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
 * Calls the server-side Vercel API route to deep-analyse a single repo.
 * The route handles GitHub data enrichment + Gemini 1.5 Pro audit.
 */
async function analyzeRepo(token, repo, ownerLogin, accountAgeDays) {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://verqify-2-0-0.vercel.app';

  const res = await fetch(`${base}/api/analyze-repo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, repo, ownerLogin, accountAgeDays }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`API error for ${repo.name}: ${err.error}`);
  }
  return res.json();
}

/**
 * Analyses the top N repos through the deep audit engine and aggregates
 * results into the fingerprint + AI personality format Supabase expects.
 */
export async function analyzeRepoBatch(providerToken, repos, ownerLogin, accountAgeDays) {
  // Pick top 5 non-fork repos sorted by most recently updated
  const targets = repos
    .filter((r) => !r.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  if (targets.length === 0) return null;

  console.log(`Verqify Engine: Deep-analysing ${targets.length} repositories via Gemini 1.5 Pro...`);

  // Analyse sequentially to avoid rate-limiting Gemini
  const results = [];
  for (const repo of targets) {
    try {
      const result = await analyzeRepo(providerToken, repo, ownerLogin, accountAgeDays);
      results.push(result);
      console.log(`  ✓ ${repo.name} — ${result.analysis?.overall_verdict?.verification_level}`);
    } catch (err) {
      console.warn(`  ✗ Skipped ${repo.name}: ${err.message}`);
    }
  }

  if (results.length === 0) return null;

  // ── Aggregate skill scores from per-repo skill_detected arrays ──
  const skillScores = {};
  const skillCounts = {};

  // Map detected skill names to our 5 radar categories
  const categoryMap = {
    Frontend: ['frontend', 'react', 'vue', 'angular', 'css', 'html', 'javascript', 'typescript', 'ui'],
    Backend: ['backend', 'api', 'server', 'node', 'python', 'go', 'java', 'rust', 'express', 'django', 'flask'],
    Database: ['database', 'sql', 'postgres', 'mysql', 'mongodb', 'supabase', 'orm'],
    DevOps: ['devops', 'docker', 'ci', 'cd', 'kubernetes', 'terraform', 'shell', 'deployment', 'nginx'],
    Architecture: ['architecture', 'system design', 'scalable', 'microservice', 'distributed'],
  };

  const strengthWeight = { weak: 20, moderate: 60, strong: 100 };

  for (const { analysis } of results) {
    if (!Array.isArray(analysis?.skills_detected)) continue;
    for (const skill of analysis.skills_detected) {
      const name = (skill.name || '').toLowerCase();
      const weight = strengthWeight[skill.evidence_strength] ?? 40;
      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some((kw) => name.includes(kw))) {
          skillScores[category] = (skillScores[category] || 0) + weight;
          skillCounts[category] = (skillCounts[category] || 0) + 1;
        }
      }
    }
  }

  const maxScore = Math.max(...Object.values(skillScores), 1);
  const radarData = [
    { name: 'Architecture', score: Math.round(((skillScores.Architecture || 0) / maxScore) * 100) || 30 },
    { name: 'Backend', score: Math.round(((skillScores.Backend || 0) / maxScore) * 100) || 25 },
    { name: 'Frontend', score: Math.round(((skillScores.Frontend || 0) / maxScore) * 100) || 25 },
    { name: 'DevOps', score: Math.round(((skillScores.DevOps || 0) / maxScore) * 100) || 15 },
    { name: 'Database', score: Math.round(((skillScores.Database || 0) / maxScore) * 100) || 15 },
  ];

  // ── Aggregate AI personality from the best verified repo ──
  const best = results
    .filter((r) => r.analysis?.overall_verdict)
    .sort((a, b) => {
      const levels = ['none', 'low', 'moderate', 'high', 'exceptional'];
      return (
        levels.indexOf(b.analysis.overall_verdict.verification_level) -
        levels.indexOf(a.analysis.overall_verdict.verification_level)
      );
    })[0];

  const personality = best?.analysis?.overall_verdict?.summary || 
    'An engineering candidate with a diverse technical background as verified by Gemini AI analysis.';

  // Aggregate dimension scores across repos
  const dims = { Velocity: 0, Quality: 0, Collaboration: 0, Complexity: 0, Innovation: 0 };
  let dimCount = 0;
  for (const { analysis } of results) {
    if (!analysis) continue;
    const cq = analysis.code_quality?.score || 0;
    const ud = analysis.understanding_depth?.score || 0;
    const cm = analysis.commit_quality?.score || 0;
    const rw = analysis.real_world_readiness?.score || 0;
    dims.Quality += cq;
    dims.Complexity += ud;
    dims.Velocity += cm;
    dims.Innovation += (cq + ud) / 2;
    dims.Collaboration += rw;
    dimCount++;
  }

  const dimensions = dimCount > 0
    ? Object.fromEntries(Object.entries(dims).map(([k, v]) => [k, Math.round(v / dimCount)]))
    : { Velocity: 70, Quality: 70, Collaboration: 70, Complexity: 70, Innovation: 70 };

  return {
    radarData,
    aiInfo: { personality, dimensions },
    repoAudits: results, // full per-repo breakdown for the UI
  };
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
    const repos = await fetchGithubRepos(token);
    const profile = await fetchGithubProfile(token);

    const ownerLogin = profile.login;
    const accountAgeDays = Math.round(
      (Date.now() - new Date(profile.created_at)) / 86400000
    );

    // Try deep engine first, fall back to legacy on failure
    let fingerprint;
    try {
      fingerprint = await analyzeRepoBatch(token, repos, ownerLogin, accountAgeDays);
    } catch (deepErr) {
      console.warn('Deep analysis failed, falling back to legacy engine:', deepErr.message);
      fingerprint = await generateSkillFingerprint(token);
    }

    if (!fingerprint) return null;

    const { radarData, aiInfo, repoAudits } = fingerprint;

    const { error } = await supabase
      .from('profiles')
      .update({
        skill_fingerprint: radarData,
        ai_personality: aiInfo.personality,
        dimension_scores: aiInfo.dimensions,
        repo_audits: repoAudits ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (error) throw error;
    return radarData;
  } catch (err) {
    console.error('Sync failed:', err);
    return null;
  }
}
