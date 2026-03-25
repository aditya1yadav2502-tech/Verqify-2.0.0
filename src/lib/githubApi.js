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
  const repos = await fetchGithubRepos(providerToken);
  
  // Aggregate language bytes
  const languageBytes = {};
  for (const repo of repos.slice(0, 15)) { // Limit to 15 most recently updated to avoid rate limits
    const langs = await fetchRepoLanguages(providerToken, repo.languages_url);
    for (const [lang, bytes] of Object.entries(langs)) {
      languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
    }
  }

  // Define our capability mappings
  const capabilityMap = {
    Backend: ['Go', 'Rust', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'C#'],
    Frontend: ['JavaScript', 'TypeScript', 'CSS', 'HTML', 'Vue', 'Svelte'],
    Database: ['SQL', 'PLpgSQL', 'TSQL'],
    DevOps: ['Shell', 'Dockerfile', 'HCL', 'Makefile', 'Nix'],
    Architecture: ['Solidity', 'Protocol Buffer', 'GraphQL'] 
  };

  const scores = {
    Backend: 0,
    Frontend: 0,
    Database: 0,
    DevOps: 0,
  };

  // Tally bytes into categories
  for (const [lang, bytes] of Object.entries(languageBytes)) {
    for (const [category, languages] of Object.entries(capabilityMap)) {
      if (languages.includes(lang)) {
        scores[category] += bytes;
      }
    }
    // Handle JS/TS cross-stack nature if needed. For now, we put them in Frontend.
    // If backend repos have Express/Nest, it requires deeper AST parsing, but this is v1.
  }

  // Normalize scores to 0-100 scale for the radar chart
  const maxScore = Math.max(...Object.values(scores), 1); // prevent division by zero
  
  return [
    { name: 'Architecture', score: Math.round(((scores.Backend * 0.5 + scores.DevOps * 0.5) / maxScore) * 100) || 40 }, // heuristic
    { name: 'Backend', score: Math.round((scores.Backend / maxScore) * 100) || 30 },
    { name: 'Frontend', score: Math.round((scores.Frontend / maxScore) * 100) || 30 },
    { name: 'DevOps', score: Math.round((scores.DevOps / maxScore) * 100) || 20 },
    { name: 'Database', score: Math.round((scores.Database / maxScore) * 100) || 20 }
  ];
}
