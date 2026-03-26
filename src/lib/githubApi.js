import { supabase } from './supabaseClient';

// ─── Raw GitHub helpers ──────────────────────────────────────────────────────

export async function fetchGithubProfile(providerToken) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${providerToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch GitHub profile');
  return response.json();
}

export async function fetchGithubRepos(providerToken) {
  const response = await fetch(
    'https://api.github.com/user/repos?per_page=100&sort=updated',
    {
      headers: {
        Authorization: `Bearer ${providerToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch repos');
  const repos = await response.json();
  return repos.filter((repo) => !repo.fork);
}

export async function fetchRepoLanguages(providerToken, languagesUrl) {
  const response = await fetch(languagesUrl, {
    headers: {
      Authorization: `Bearer ${providerToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!response.ok) return {};
  return response.json();
}

// ─── Deep Analysis Engine ────────────────────────────────────────────────────

/**
 * Single API call to /api/analyze-all — the server handles all repos,
 * parallel Gemini analysis, skill aggregation, and personality synthesis.
 */
export async function callAnalyzeAll(token, githubUsername) {
  const base = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://verqify-2-0-0.vercel.app';

  const res = await fetch(`${base}/api/analyze-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, githubUsername }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Analysis API error: ${err.error}`);
  }
  return res.json();
  // Returns: { skills, dimensions, personality, reposAnalyzed,
  //            overallVerificationLevel, redFlags, standoutSignals, repoAudits }
}

/**
 * Maps the /api/analyze-all result into the Supabase fingerprint format.
 * dimensions: { impact, depth, consistency, breadth, ships } (0-100 each)
 * radarData: 5-point array for the existing radar chart component.
 */
function mapToFingerprint(result) {
  const { dimensions } = result;
  const radarData = [
    { name: 'Impact',       score: dimensions.impact       ?? 50 },
    { name: 'Depth',        score: dimensions.depth        ?? 50 },
    { name: 'Consistency',  score: dimensions.consistency  ?? 50 },
    { name: 'Breadth',      score: dimensions.breadth      ?? 50 },
    { name: 'Ships',        score: dimensions.ships        ?? 50 },
  ];
  return { radarData };
}


// ─── Legacy fingerprint (kept for fallback / demo) ───────────────────────────

export async function generateSkillFingerprint(providerToken) {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  await sleep(1000);

  let repos = [];
  try {
    if (providerToken && providerToken !== 'demo_token') {
      repos = await fetchGithubRepos(providerToken);
    }
  } catch {
    console.warn('GitHub API failed, falling back to heuristic data');
  }

  if (repos.length === 0) {
    return {
      radarData: [
        { name: 'Architecture', score: 72 },
        { name: 'Backend', score: 88 },
        { name: 'Frontend', score: 42 },
        { name: 'DevOps', score: 65 },
        { name: 'Database', score: 55 },
      ],
      aiInfo: {
        personality: 'An architecturally-minded engineer with a focus on scalable backend systems.',
        dimensions: { Velocity: 85, Quality: 92, Collaboration: 78, Complexity: 88, Innovation: 82 },
      },
    };
  }

  const languageBytes = {};
  for (const repo of repos.slice(0, 10)) {
    try {
      const langs = await fetchRepoLanguages(providerToken, repo.languages_url);
      for (const [lang, bytes] of Object.entries(langs)) {
        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
      }
    } catch { continue; }
  }

  const capabilityMap = {
    Backend: ['Go', 'Rust', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'C#'],
    Frontend: ['JavaScript', 'TypeScript', 'CSS', 'HTML', 'Vue', 'Svelte'],
    Database: ['SQL', 'PLpgSQL', 'TSQL'],
    DevOps: ['Shell', 'Dockerfile', 'HCL', 'Makefile', 'Nix'],
  };

  const scores = { Backend: 0, Frontend: 0, Database: 0, DevOps: 0 };
  for (const [lang, bytes] of Object.entries(languageBytes)) {
    for (const [category, languages] of Object.entries(capabilityMap)) {
      if (languages.includes(lang)) scores[category] += bytes;
    }
  }

  const maxScore = Math.max(...Object.values(scores), 1);
  return {
    radarData: [
      { name: 'Architecture', score: Math.round(((scores.Backend * 0.6 + scores.DevOps * 0.4) / maxScore) * 100) || 45 },
      { name: 'Backend', score: Math.round((scores.Backend / maxScore) * 100) || 30 },
      { name: 'Frontend', score: Math.round((scores.Frontend / maxScore) * 100) || 30 },
      { name: 'DevOps', score: Math.round((scores.DevOps / maxScore) * 100) || 20 },
      { name: 'Database', score: Math.round((scores.Database / maxScore) * 100) || 20 },
    ],
    aiInfo: {
      personality: 'A versatile developer with a strong foundation in modern engineering principles.',
      dimensions: { Velocity: 70, Quality: 75, Collaboration: 70, Complexity: 70, Innovation: 70 },
    },
  };
}

// ─── Sync Orchestrator ───────────────────────────────────────────────────────

export async function syncGitHubData() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.provider_token;

  if (!token) {
    console.error('No GitHub token found in session');
    return null;
  }

  try {
    const ghProfile = await fetchGithubProfile(token);
    const githubUsername = ghProfile.login;

    // 1. Ensure student record exists with current tokens
    // This allows the background API to fetch data
    await supabase
      .from('students')
      .upsert({
        id: session.user.id,
        github_username: githubUsername,
        github_access_token: token,
        updated_at: new Date().toISOString(),
      });

    // 2. Call the new generation endpoint
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const response = await fetch(`${base}/api/fingerprint/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: session.user.id }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(err.error || 'Fingerprint generation failed');
    }

    const { result } = await response.json();

    // 3. Keep profiles table in sync for general UI (legacy compatibility)
    const { radarData } = mapToFingerprint(result);
    await supabase
      .from('profiles')
      .update({
        skill_fingerprint: radarData,
        ai_personality: result.personality,
        engineer_type: result.engineerType,
        strongest_signal: result.strongestSignal,
        dimension_scores: {
          ...result.dimensions,
          overallVerificationLevel: result.overallVerificationLevel,
          reposAnalyzed: result.reposAnalyzed,
        },
        repo_audits: result.repoAudits ?? null,
        all_skills: result.skills ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    return radarData;
  } catch (err) {
    console.error('Sync failed:', err);
    return null;
  }
}
