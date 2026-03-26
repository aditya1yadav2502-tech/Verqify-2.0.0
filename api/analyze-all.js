import { analyzeAllRepos } from './_lib/engine';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const { token, githubUsername } = req.body;

  if (!token || !githubUsername) {
    return res.status(400).json({ error: 'Missing required fields: token, githubUsername' });
  }

  try {
    console.log(`[analyze-all] Starting full analysis for @${githubUsername}`);
    const result = await analyzeAllRepos(githubUsername, token);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[analyze-all] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
