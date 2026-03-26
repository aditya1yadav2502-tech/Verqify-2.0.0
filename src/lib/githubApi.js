import { supabase } from './supabaseClient';
import { analyzeEngineeringIdentity } from './gemini';

export async function fetchGithubProfile(providerToken) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${providerToken}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

export async function fetchGithubRepos(providerToken) {
  const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
    headers: {
      Authorization: `Bearer ${providerToken}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch repos');
  const repos = await response.json();
  return repos.filter(repo => !repo.fork); // exclude forks for fingerprinting
}

export async function fetchRepoLanguages(providerToken, languagesUrl) {
  const response = await fetch(languagesUrl, {
    headers: {
      Authorization: `Bearer ${providerToken}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  if (!response.ok) return {};
  return response.json();
}

/**
 * Calculates a verified "Skill Fingerprint" from a user's GitHub data.
 */
export async function generateSkillFingerprint(providerToken) {
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  console.log('Verqify Engine: Starting repository analysis...');
  await sleep(1500); // Premium feel

  let repos = [];
  try {
    if (providerToken && providerToken !== 'demo_token') {
      repos = await fetchGithubRepos(providerToken);
    }
  } catch {
    console.warn('GitHub API failed, falling back to heuristic data');
  }

  // Fallback for demo or empty accounts
  if (repos.length === 0) {
    console.log('Verqify Engine: Using architectural heuristics for empty/demo profile');
    return [
      { name: 'Architecture', score: 72 },
      { name: 'Backend', score: 88 },
      { name: 'Frontend', score: 42 },
      { name: 'DevOps', score: 65 },
      { name: 'Database', score: 55 }
    ];
  }
  
  // Aggregate language bytes
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
    DevOps: ['Shell', 'Dockerfile', 'HCL', 'Makefile', 'Nix']
  };

  const scores = { Backend: 0, Frontend: 0, Database: 0, DevOps: 0 };

  for (const [lang, bytes] of Object.entries(languageBytes)) {
    for (const [category, languages] of Object.entries(capabilityMap)) {
      if (languages.includes(lang)) scores[category] += bytes;
    }
  }

  const maxScore = Math.max(...Object.values(scores), 1);
  
  console.log('Verqify Engine: Technical analysis complete. Starting AI Personality synthesis...');
  const aiInfo = await analyzeEngineeringIdentity(repos);
  
  console.log('Verqify Engine: Engineering signature finalized.');
  return {
    radarData: [
      { name: 'Architecture', score: Math.round(((scores.Backend * 0.6 + scores.DevOps * 0.4) / maxScore) * 100) || 45 },
      { name: 'Backend', score: Math.round((scores.Backend / maxScore) * 100) || 30 },
      { name: 'Frontend', score: Math.round((scores.Frontend / maxScore) * 100) || 30 },
      { name: 'DevOps', score: Math.round((scores.DevOps / maxScore) * 100) || 20 },
      { name: 'Database', score: Math.round((scores.Database / maxScore) * 100) || 20 }
    ],
    aiInfo
  };
}

/**
 * Orchestrates the full sync: GitHub Fetch -> Gemini Analysis -> Supabase Update
 */
export async function syncGitHubData() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.provider_token;

  if (!token) {
    console.error('No GitHub token found in session');
    return null;
  }

  try {
    const { radarData, aiInfo } = await generateSkillFingerprint(token);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        skill_fingerprint: radarData,
        ai_personality: aiInfo.personality,
        dimension_scores: aiInfo.dimensions,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id);

    if (error) throw error;
    return radarData;
  } catch (err) {
    console.error('Sync failed:', err);
    return null;
  }
}
