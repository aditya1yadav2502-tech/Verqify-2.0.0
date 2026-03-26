import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Server-side Supabase client with service role for backend updates
export const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ─── GitHub Data Collector ────────────────────────────────────────────────────

export async function collectRepoData(githubUsername, repoName, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Verqify-Analysis-Engine/1.0',
  };
  const base = 'https://api.github.com';

  const repo = await fetch(`${base}/repos/${githubUsername}/${repoName}`, { headers }).then(r => r.json());

  const [languages, commits, tree, readmeRes] = await Promise.all([
    fetch(`${base}/repos/${githubUsername}/${repoName}/languages`, { headers }).then(r => r.json()),
    fetch(`${base}/repos/${githubUsername}/${repoName}/commits?per_page=100`, { headers }).then(r => r.json()),
    fetch(`${base}/repos/${githubUsername}/${repoName}/git/trees/HEAD?recursive=1`, { headers }).then(r => r.json()),
    fetch(`${base}/repos/${githubUsername}/${repoName}/readme`, { headers }).then(r => r.json()),
  ]);

  const readme = readmeRes.content
    ? Buffer.from(readmeRes.content, 'base64').toString('utf8').slice(0, 2000)
    : 'No README found';

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

  const commitDates = Array.isArray(commits)
    ? commits.map(c => new Date(c.commit.author.date)).sort((a, b) => a - b)
    : [];
  const commitSpreadDays = commitDates.length > 1
    ? Math.floor((commitDates[commitDates.length - 1] - commitDates[0]) / 86400000)
    : 0;

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

// ─── Per-Repo Gemini Audit ────────────────────────────────────────────────────

export async function analyzeCodeQuality(repoData) {
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

Analyze this repository. Return ONLY valid JSON, no markdown, no explanation, no backticks. Raw JSON only.

{
  "is_original": { "verdict": true, "confidence": 0-100, "reason": "one sentence" },
  "is_tutorial_or_clone": { "verdict": false, "confidence": 0-100, "detected_pattern": null, "reason": "one sentence" },
  "code_quality": {
    "score": 0-100, "level": "surface|beginner|intermediate|advanced",
    "signals": { "has_error_handling": true, "has_meaningful_variable_names": true, "has_modular_structure": true, "has_comments_or_docs": true, "has_consistent_style": true, "has_test": false },
    "reason": "2-3 sentences"
  },
  "understanding_depth": { "score": 0-100, "level": "copy_paste|surface|moderate|deep", "reason": "2-3 sentences" },
  "commit_quality": { "score": 0-100, "pattern": "burst|irregular|consistent|professional", "has_meaningful_messages": true, "suspicious_activity": false, "suspicious_reason": null },
  "real_world_readiness": { "score": 0-100, "level": "toy|learning|presentable|production_ready", "reason": "2-3 sentences" },
  "skills_detected": [{ "name": "skill name", "evidence_strength": "weak|moderate|strong", "status": "claimed|demonstrated|verified", "proof": "one sentence" }],
  "overall_verdict": {
    "genuine_work": true,
    "verification_level": "none|low|moderate|high|exceptional",
    "summary": "3-4 sentences. Direct and specific.",
    "red_flags": [],
    "standout_signals": []
  }
}

STRICT RULES:
- Sloppy commit messages ("fix", "update", "asdf") → flag low quality
- Mass-committed within 7 days → flag suspicious
- YouTube tutorial pattern (todo, weather, netflix clone) → is_tutorial_or_clone true
- README more impressive than code → note it
- Forked + 3 commits → not their work
- Deployed project scores much higher than undeployed
- New account with 300 commits → suspicious
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  }
}

// ─── Cross-Repo Persona Synthesis ────────────────────────────────────────────

export async function generatePersonality(username, analyses, skills) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const verifiedSkills = skills.filter(s => s.status === 'verified');
  const demonstratedSkills = skills.filter(s => s.status === 'demonstrated');
  const redFlags = analyses.flatMap(a => a.overall_verdict?.red_flags || []);
  const standouts = analyses.flatMap(a => a.overall_verdict?.standout_signals || []);

  const prompt = `
You are writing the engineering identity description for a student's 
public Verqify profile. This description will be seen by hiring companies.

Student data:
- Verified skills: ${verifiedSkills.map(s => s.name).join(', ') || 'none'}
- Demonstrated skills: ${demonstratedSkills.map(s => s.name).join(', ') || 'none'}
- Repos analyzed: ${analyses.length}
- Standout signals: ${standouts.join(', ') || 'none'}
- Red flags: ${redFlags.join(', ') || 'none'}
- Code quality levels: ${analyses.map(a => a.code_quality?.level).join(', ')}
- Commit patterns: ${analyses.map(a => a.commit_quality?.pattern).join(', ')}
- Real world readiness: ${analyses.map(a => a.real_world_readiness?.level).join(', ')}

Write 2-3 sentences that describe this engineer's actual working style.
Be specific, honest, and direct. Name real patterns you observed.
Do not use generic phrases like "passionate developer" or "quick learner."
Do not be encouraging if the work doesn't deserve it.
Do not mention red flags directly — just describe what the work shows.

Return ONLY a JSON object, no markdown:
{
  "description": "2-3 sentence personality description",
  "engineer_type": "one of: Backend Specialist, Frontend Builder, Full Stack Generalist, Systems Engineer, DevOps Engineer, ML Engineer, Mobile Developer, Early Stage Builder",
  "strongest_signal": "the single most impressive thing about their work in one sentence"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  }
}

// ─── Dimension Calculators ────────────────────────────────────────────────────

function calculateImpact(analyses) {
  const deployedCount = analyses.filter(
    a => a.real_world_readiness?.level === 'production_ready' ||
         a.real_world_readiness?.level === 'presentable'
  ).length;
  const avgReadiness = analyses.reduce((sum, a) => sum + (a.real_world_readiness?.score || 0), 0) / analyses.length;
  return Math.min(100, Math.round((deployedCount / analyses.length) * 100 * 0.5 + avgReadiness * 0.5));
}

function calculateDepth(analyses) {
  return Math.round(analyses.reduce((sum, a) => sum + (a.understanding_depth?.score || 0), 0) / analyses.length);
}

function calculateConsistency(analyses) {
  return Math.round(analyses.reduce((sum, a) => sum + (a.commit_quality?.score || 0), 0) / analyses.length);
}

function calculateBreadth(analyses) {
  const uniqueSkills = new Set(
    analyses.flatMap(a => (a.skills_detected || []).map(s => s.name))
  );
  return Math.min(100, uniqueSkills.size * 12);
}

function calculateShips(analyses) {
  const deployed = analyses.filter(a => a.real_world_readiness?.level !== 'toy').length;
  return Math.round((deployed / analyses.length) * 100);
}

function getOverallLevel(analyses) {
  const levels = ['none', 'low', 'moderate', 'high', 'exceptional'];
  const scores = analyses.map(a => levels.indexOf(a.overall_verdict?.verification_level || 'none'));
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return levels[Math.round(avg)];
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────

export async function analyzeAllRepos(githubUsername, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Verqify-Analysis-Engine/1.0',
  };

  const repos = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?per_page=50&sort=pushed`,
    { headers }
  ).then(r => r.json());

  if (!Array.isArray(repos)) throw new Error('Failed to fetch repos from GitHub');

  const meaningfulRepos = repos.filter(r =>
    !r.fork &&
    r.size > 10 &&
    r.name !== `${githubUsername}.github.io`
  ).slice(0, 10);

  if (meaningfulRepos.length === 0) throw new Error('No meaningful repositories found to analyse');

  const analyses = await Promise.all(
    meaningfulRepos.map(repo =>
      collectRepoData(githubUsername, repo.name, accessToken)
        .then(data => analyzeCodeQuality(data))
        .catch(err => {
          console.warn(`  Skipped ${repo.name}: ${err.message}`);
          return null;
        })
    )
  );

  const valid = analyses.filter(Boolean);
  if (valid.length === 0) throw Error('All repository analyses failed');

  const skillMap = {};
  const hierarchy = ['claimed', 'demonstrated', 'verified'];

  for (const analysis of valid) {
    for (const skill of analysis.skills_detected || []) {
      const key = skill.name.toLowerCase();
      if (!skillMap[key]) {
        skillMap[key] = {
          name: skill.name,
          status: skill.status,
          evidenceStrength: skill.evidence_strength,
          repoCount: 1,
          proofs: [skill.proof],
        };
      } else {
        skillMap[key].repoCount++;
        skillMap[key].proofs.push(skill.proof);
        const current = hierarchy.indexOf(skillMap[key].status);
        const incoming = hierarchy.indexOf(skill.status);
        if (incoming > current) {
          skillMap[key].status = skill.status;
          skillMap[key].evidenceStrength = skill.evidence_strength;
        }
      }
    }
  }

  const dimensions = {
    impact: calculateImpact(valid),
    depth: calculateDepth(valid),
    consistency: calculateConsistency(valid),
    breadth: calculateBreadth(valid),
    ships: calculateShips(valid),
  };

  const allSkills = Object.values(skillMap);
  const personality = await generatePersonality(githubUsername, valid, allSkills);

  return {
    skills: allSkills,
    dimensions,
    personality: personality.description,
    engineerType: personality.engineer_type,
    strongestSignal: personality.strongest_signal,
    reposAnalyzed: valid.length,
    overallVerificationLevel: getOverallLevel(valid),
    redFlags: valid.flatMap(a => a.overall_verdict?.red_flags || []),
    standoutSignals: valid.flatMap(a => a.overall_verdict?.standout_signals || []),
    repoAudits: meaningfulRepos.slice(0, valid.length).map((repo, i) => ({
        repo: repo.name,
        analysis: valid[i],
    })),
  };
}
