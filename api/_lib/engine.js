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

// ─── Quantitative Skill Verification ─────────────────────────────────────────

const TUTORIAL_PATTERNS = [
  'todo-app', 'todo-list', 'todolist', 'weather-app', 'weather-api',
  'netflix-clone', 'spotify-clone', 'twitter-clone', 'instagram-clone',
  'calculator', 'calculator-app', 'portfolio', 'landing-page',
  'tic-tac-toe', 'snake-game', 'rock-paper-scissors', 'quiz-app',
  'ecommerce', 'e-commerce', 'blog-app', 'chat-app', 'notes-app',
];

/**
 * Quantitative scoring per skill based on hard evidence.
 * Returns { status, verificationScore, repoCount, totalCommits,
 *           commitSpreadDays, deployedCount, monthsActive }
 */
export function calculateSkillVerification(skillName, skillRepos, allAnalyses) {
  let score = 0;

  // Count repos where this skill was detected
  const repoCount = skillRepos.length;
  if (repoCount >= 1) score += 10;
  if (repoCount >= 3) score += 10;

  // Aggregate commit data across repos with this skill
  let totalCommits = 0;
  let maxSpreadDays = 0;
  let deployedCount = 0;
  let earliestCommit = null;
  let latestCommit = null;

  for (const repoAnalysis of skillRepos) {
    totalCommits += repoAnalysis.totalCommits || 0;
    maxSpreadDays = Math.max(maxSpreadDays, repoAnalysis.commitSpreadDays || 0);
    if (repoAnalysis.hasDeployment) deployedCount++;
    // Track earliest and latest for months-active calculation
    if (repoAnalysis.commitSpreadDays > 0) {
      const spread = repoAnalysis.commitSpreadDays;
      if (!earliestCommit || spread > earliestCommit) earliestCommit = spread;
    }
  }

  // Commit depth
  if (totalCommits > 50) score += 10;
  if (totalCommits > 200) score += 10;

  // Consistency
  if (maxSpreadDays > 30) score += 10;
  if (maxSpreadDays > 90) score += 10;

  // Deployment
  if (deployedCount > 0) score += 15;

  // External proof (hackathon/internship) — placeholder for future uploads
  // if (proofData.hasInternship) score += 15;
  // if (proofData.hasHackathonWin) score += 10;

  const monthsActive = Math.max(1, Math.round(maxSpreadDays / 30));

  // Map to status
  let status;
  if (score >= 70) status = 'verified';
  else if (score >= 35) status = 'demonstrated';
  else status = 'claimed';

  return {
    status,
    verificationScore: Math.min(100, score),
    repoCount,
    totalCommits,
    commitSpreadDays: maxSpreadDays,
    deployedCount,
    monthsActive,
  };
}

// ─── Anti-Gaming Detection ───────────────────────────────────────────────────

export function detectAntiGamingFlags(repoDataList, analyses) {
  const flags = [];
  let penaltyScore = 0;

  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    const repoData = repoDataList[i];
    if (!analysis || !repoData) continue;

    const repoName = repoData.name?.toLowerCase() || '';

    // 1. Tutorial detection
    if (TUTORIAL_PATTERNS.some(p => repoName.includes(p))) {
      flags.push(`Tutorial pattern detected: "${repoData.name}"`);
      penaltyScore += 5;
    }
    if (analysis.is_tutorial_or_clone?.verdict) {
      flags.push(`Gemini flagged "${repoData.name}" as tutorial/clone`);
      penaltyScore += 8;
    }

    // 2. Commit spam (50+ on same day from commit messages pattern)
    const commitMsgs = repoData.commitMessages || [];
    const uniqueMsgs = new Set(commitMsgs);
    if (commitMsgs.length > 10 && uniqueMsgs.size < commitMsgs.length * 0.3) {
      flags.push(`Repetitive commit messages in "${repoData.name}" (${uniqueMsgs.size}/${commitMsgs.length} unique)`);
      penaltyScore += 10;
    }

    // 3. Burst activity (mass commits in very short window)
    if (analysis.commit_quality?.pattern === 'burst') {
      flags.push(`Burst commit pattern in "${repoData.name}"`);
      penaltyScore += 5;
    }
    if (analysis.commit_quality?.suspicious_activity) {
      flags.push(`Suspicious activity: ${analysis.commit_quality.suspicious_reason || 'flagged by AI'}`);
      penaltyScore += 10;
    }

    // 4. Fake deployment (has URL but surface-level code)
    if (repoData.hasDeployment && analysis.code_quality?.level === 'surface') {
      flags.push(`Deployed but surface-level code in "${repoData.name}"`);
      penaltyScore += 5;
    }
  }

  // 5. Account age vs activity
  const totalCommits = repoDataList.reduce((s, r) => s + (r?.totalCommits || 0), 0);
  const accountAge = repoDataList[0]?.accountAgeDays || 365;
  if (accountAge < 30 && totalCommits > 200) {
    flags.push(`New account (${accountAge} days) with ${totalCommits} commits`);
    penaltyScore += 15;
  } else if (accountAge < 14 && totalCommits > 50) {
    flags.push(`Very new account (${accountAge} days) with rapid activity`);
    penaltyScore += 10;
  }

  return { flags, penaltyScore: Math.min(penaltyScore, 40) }; // Cap penalty at 40
}

/**
 * Compute company-facing confidence level from aggregated data.
 */
export function getConfidenceLevel(skills, dimensions, antiGamingFlags) {
  const verifiedCount = skills.filter(s => s.status === 'verified').length;
  const demonstratedCount = skills.filter(s => s.status === 'demonstrated').length;
  const totalDeployed = skills.reduce((s, sk) => s + (sk.deployedCount || 0), 0);
  const avgScore = dimensions
    ? Math.round(Object.values(dimensions).reduce((a, b) => a + b, 0) / Object.keys(dimensions).length)
    : 0;
  const penalty = antiGamingFlags?.length || 0;

  if (verifiedCount >= 2 && totalDeployed >= 2 && avgScore >= 60 && penalty === 0) return 'high';
  if ((verifiedCount >= 1 || demonstratedCount >= 2) && avgScore >= 40 && penalty <= 2) return 'moderate';
  return 'low';
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

  // Collect repoData AND analyses in parallel (need repoData for anti-gaming)
  const results = await Promise.all(
    meaningfulRepos.map(async (repo) => {
      try {
        const data = await collectRepoData(githubUsername, repo.name, accessToken);
        const analysis = await analyzeCodeQuality(data);
        return { data, analysis };
      } catch (err) {
        console.warn(`  Skipped ${repo.name}: ${err.message}`);
        return null;
      }
    })
  );

  const validResults = results.filter(Boolean);
  if (validResults.length === 0) throw Error('All repository analyses failed');

  const validAnalyses = validResults.map(r => r.analysis);
  const validRepoData = validResults.map(r => r.data);

  // ─── Anti-Gaming Detection ───────────────────────────────────────────
  const antiGaming = detectAntiGamingFlags(validRepoData, validAnalyses);

  // ─── Skill Aggregation with Quantitative Scoring ─────────────────────
  // First pass: collect which repos contain which skills
  const skillRepoMap = {}; // skillName -> [{ repoData, analysis }]

  for (let i = 0; i < validResults.length; i++) {
    const { data, analysis } = validResults[i];
    for (const skill of analysis.skills_detected || []) {
      const key = skill.name.toLowerCase();
      if (!skillRepoMap[key]) {
        skillRepoMap[key] = { name: skill.name, repos: [], proofs: [], evidenceStrength: skill.evidence_strength };
      }
      skillRepoMap[key].repos.push({
        totalCommits: data.totalCommits,
        commitSpreadDays: data.commitSpreadDays,
        hasDeployment: data.hasDeployment,
      });
      skillRepoMap[key].proofs.push(skill.proof);
      // Keep strongest evidence
      const strengthOrder = ['weak', 'moderate', 'strong'];
      if (strengthOrder.indexOf(skill.evidence_strength) > strengthOrder.indexOf(skillRepoMap[key].evidenceStrength)) {
        skillRepoMap[key].evidenceStrength = skill.evidence_strength;
      }
    }
  }

  // Second pass: compute verification score for each skill
  const allSkills = Object.entries(skillRepoMap).map(([key, skillData]) => {
    const verification = calculateSkillVerification(skillData.name, skillData.repos, validAnalyses);

    // Apply anti-gaming penalty
    const penalizedScore = Math.max(0, verification.verificationScore - antiGaming.penaltyScore);
    let finalStatus = verification.status;
    if (penalizedScore < 35 && finalStatus !== 'claimed') finalStatus = 'claimed';
    else if (penalizedScore < 70 && finalStatus === 'verified') finalStatus = 'demonstrated';

    return {
      name: skillData.name,
      status: finalStatus,
      evidenceStrength: skillData.evidenceStrength,
      verificationScore: penalizedScore,
      repoCount: verification.repoCount,
      totalCommits: verification.totalCommits,
      commitSpreadDays: verification.commitSpreadDays,
      deployedCount: verification.deployedCount,
      monthsActive: verification.monthsActive,
      proofs: skillData.proofs,
    };
  });

  // Sort: verified first, then demonstrated, then claimed
  const statusOrder = { verified: 0, demonstrated: 1, claimed: 2 };
  allSkills.sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3));

  // ─── Dimensions ──────────────────────────────────────────────────────
  const dimensions = {
    impact: calculateImpact(validAnalyses),
    depth: calculateDepth(validAnalyses),
    consistency: calculateConsistency(validAnalyses),
    breadth: calculateBreadth(validAnalyses),
    ships: calculateShips(validAnalyses),
  };

  // ─── Confidence Level ────────────────────────────────────────────────
  const confidenceLevel = getConfidenceLevel(allSkills, dimensions, antiGaming.flags);

  // ─── Personality Synthesis ───────────────────────────────────────────
  const personality = await generatePersonality(githubUsername, validAnalyses, allSkills);

  return {
    skills: allSkills,
    dimensions,
    personality: personality.description,
    engineerType: personality.engineer_type,
    strongestSignal: personality.strongest_signal,
    reposAnalyzed: validAnalyses.length,
    overallVerificationLevel: getOverallLevel(validAnalyses),
    confidenceLevel,
    antiGamingFlags: antiGaming.flags,
    antiGamingPenalty: antiGaming.penaltyScore,
    redFlags: validAnalyses.flatMap(a => a.overall_verdict?.red_flags || []),
    standoutSignals: validAnalyses.flatMap(a => a.overall_verdict?.standout_signals || []),
    repoAudits: meaningfulRepos.slice(0, validResults.length).map((repo, i) => ({
        repo: repo.name,
        analysis: validAnalyses[i],
    })),
  };
}
