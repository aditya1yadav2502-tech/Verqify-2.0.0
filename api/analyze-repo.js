import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── GitHub Data Collector ────────────────────────────────────────────────────

async function collectRepoData(githubUsername, repoName, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Verqify-Analysis-Engine/1.0',
  };
  const base = 'https://api.github.com';

  // Fetch repo metadata
  const repo = await fetch(`${base}/repos/${githubUsername}/${repoName}`, { headers }).then(r => r.json());

  // Fetch in parallel
  const [languages, commits, tree, readmeRes] = await Promise.all([
    fetch(`${base}/repos/${githubUsername}/${repoName}/languages`, { headers }).then(r => r.json()),
    fetch(`${base}/repos/${githubUsername}/${repoName}/commits?per_page=100`, { headers }).then(r => r.json()),
    fetch(`${base}/repos/${githubUsername}/${repoName}/git/trees/HEAD?recursive=1`, { headers }).then(r => r.json()),
    fetch(`${base}/repos/${githubUsername}/${repoName}/readme`, { headers }).then(r => r.json()),
  ]);

  // Properly decode README from base64
  const readme = readmeRes.content
    ? Buffer.from(readmeRes.content, 'base64').toString('utf8').slice(0, 2000)
    : 'No README found';

  // Sample code from main source files
  const mainFiles = tree.tree
    ?.filter(f =>
      f.type === 'blob' &&
      (f.path.endsWith('.js') || f.path.endsWith('.ts') ||
       f.path.endsWith('.py') || f.path.endsWith('.jsx') || f.path.endsWith('.tsx')) &&
      !f.path.includes('node_modules') &&
      !f.path.includes('.min.') &&
      !f.path.includes('dist/')
    )
    .slice(0, 3) || [];

  let sampleCode = '';
  for (const file of mainFiles) {
    const content = await fetch(`${base}/repos/${githubUsername}/${repoName}/contents/${file.path}`, { headers }).then(r => r.json());
    if (content.content) {
      const decoded = Buffer.from(content.content, 'base64').toString('utf8');
      sampleCode += `\n\n// FILE: ${file.path}\n${decoded.slice(0, 800)}`;
    }
  }

  // Commit spread
  const commitDates = Array.isArray(commits)
    ? commits.map(c => new Date(c.commit.author.date)).sort((a, b) => a - b)
    : [];
  const commitSpreadDays = commitDates.length > 1
    ? Math.floor((commitDates[commitDates.length - 1] - commitDates[0]) / 86400000)
    : 0;

  // Account age
  const userRes = await fetch(`${base}/users/${githubUsername}`, { headers }).then(r => r.json());
  const accountAgeDays = Math.floor((Date.now() - new Date(userRes.created_at)) / 86400000);

  return {
    name: repo.name,
    description: repo.description || '',
    languages: languages || {},
    totalCommits: Array.isArray(commits) ? commits.length : 0,
    commitSpreadDays,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    isForked: repo.fork ?? false,
    hasDeployment: !!repo.homepage,
    liveUrl: repo.homepage || null,
    daysSinceLastCommit: Array.isArray(commits) && commits[0]
      ? Math.floor((Date.now() - new Date(commits[0].commit.author.date)) / 86400000)
      : 999,
    accountAgeDays,
    commitMessages: Array.isArray(commits)
      ? commits.slice(0, 20).map(c => c.commit.message.split('\n')[0])
      : [],
    fileTree: tree.tree
      ?.filter(f => f.type === 'blob')
      .map(f => f.path)
      .slice(0, 50)
      .join('\n') || '',
    sampleCode: sampleCode.slice(0, 3000),
    readme,
  };
}

// ─── Gemini Audit ─────────────────────────────────────────────────────────────

async function analyzeCodeQuality(repoData) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `
You are a senior engineering hiring manager at a top tech company.
You are reviewing a student's GitHub repository to verify if their 
claimed skills are genuine.

Be honest and strict. Do not be generous. A student with surface-level 
work should get surface-level results. Your analysis will be used to 
give students a verified engineering identity — accuracy matters more 
than encouragement.

---

REPOSITORY DATA:
Name: ${repoData.name}
Description: ${repoData.description}
Languages: ${JSON.stringify(repoData.languages)}
Total commits: ${repoData.totalCommits}
Commit spread: ${repoData.commitSpreadDays} days
Stars: ${repoData.stars}
Forks: ${repoData.forks}
Is forked from another repo: ${repoData.isForked}
Has live deployment URL: ${repoData.hasDeployment}
Live URL: ${repoData.liveUrl || 'none'}
Days since last commit: ${repoData.daysSinceLastCommit}
Account age in days: ${repoData.accountAgeDays}

SAMPLE COMMIT MESSAGES (last 20):
${repoData.commitMessages.join('\n')}

SAMPLE FILE STRUCTURE:
${repoData.fileTree}

SAMPLE CODE (up to 200 lines from main files):
${repoData.sampleCode}

README CONTENT:
${repoData.readme}

---

Analyze this repository across six dimensions. Return ONLY valid JSON,
no markdown, no explanation, no backticks. Raw JSON only.

{
  "is_original": {
    "verdict": true or false,
    "confidence": 0-100,
    "reason": "one sentence explanation"
  },
  "is_tutorial_or_clone": {
    "verdict": true or false,
    "confidence": 0-100,
    "detected_pattern": "name of tutorial/clone if detected, else null",
    "reason": "one sentence explanation"
  },
  "code_quality": {
    "score": 0-100,
    "level": "surface|beginner|intermediate|advanced",
    "signals": {
      "has_error_handling": true or false,
      "has_meaningful_variable_names": true or false,
      "has_modular_structure": true or false,
      "has_comments_or_docs": true or false,
      "has_consistent_style": true or false,
      "has_tests": true or false
    },
    "reason": "2-3 sentences on what the code quality reveals about the student"
  },
  "understanding_depth": {
    "score": 0-100,
    "level": "copy_paste|surface|moderate|deep",
    "reason": "2-3 sentences — does the student understand what they built or just assembled it?"
  },
  "commit_quality": {
    "score": 0-100,
    "pattern": "burst|irregular|consistent|professional",
    "has_meaningful_messages": true or false,
    "suspicious_activity": true or false,
    "suspicious_reason": "reason if suspicious, else null"
  },
  "real_world_readiness": {
    "score": 0-100,
    "level": "toy|learning|presentable|production_ready",
    "reason": "2-3 sentences on whether this could work in a real company context"
  },
  "skills_detected": [
    {
      "name": "skill name",
      "evidence_strength": "weak|moderate|strong",
      "status": "claimed|demonstrated|verified",
      "proof": "one sentence on what in the code proves this skill"
    }
  ],
  "overall_verdict": {
    "genuine_work": true or false,
    "verification_level": "none|low|moderate|high|exceptional",
    "summary": "3-4 sentences. Be direct and specific. Name what the student is good at and where the gaps are. This will be shown to hiring companies.",
    "red_flags": ["list any concerns, empty array if none"],
    "standout_signals": ["list anything impressive, empty array if nothing stands out"]
  }
}

---

STRICT RULES:
- If commit messages are all "fix", "update", "changes", "asdf" — flag as low quality
- If repo was created and mass-committed within 7 days — flag as suspicious
- If code is clearly a YouTube tutorial project (todo app, weather app, 
  netflix clone, amazon clone) — mark is_tutorial_or_clone as true
- If the README is more impressive than the actual code — note this
- If the student forked someone else's repo and made 3 commits — 
  this is not their work
- A live deployed project with real functionality scores much higher 
  than an undeployed project regardless of code quality
- Account age matters — a 2-week-old account with 300 commits is 
  suspicious regardless of code quality
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const { token, repoName, githubUsername } = req.body;

  if (!token || !repoName || !githubUsername) {
    return res.status(400).json({ error: 'Missing required fields: token, repoName, githubUsername' });
  }

  try {
    const repoData = await collectRepoData(githubUsername, repoName, token);
    const analysis = await analyzeCodeQuality(repoData);
    return res.status(200).json({ repo: repoName, analysis });
  } catch (err) {
    console.error('[analyze-repo] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
