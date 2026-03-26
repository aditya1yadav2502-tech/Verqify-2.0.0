import { analyzeAllRepos, supabaseAdmin } from '../_lib/engine';

/**
 * API route: /api/fingerprint/generate
 * Performs full repository analysis and saves to students/skills tables.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: 'Missing studentId' });
  }

  try {
    // 1. Get student's GitHub credentials from Supabase
    // Note: Falling back to profiles if students table is empty/not used yet
    const { data: student, error: fetchErr } = await supabaseAdmin
      .from('students')
      .select('github_username, github_access_token')
      .eq('id', studentId)
      .single();

    if (fetchErr || !student?.github_username || !student?.github_access_token) {
       return res.status(404).json({ error: 'Student GitHub credentials not found. Ensure GitHub is connected.' });
    }

    console.log(`[fingerprint-generate] Starting full analysis for student ${studentId} (@${student.github_username})`);

    // 2. Run full analysis
    const result = await analyzeAllRepos(
      student.github_username,
      student.github_access_token
    );

    // 3. Save full fingerprint to students table
    await supabaseAdmin
      .from('students')
      .update({ 
        fingerprint_data: result,
        updated_at: new Date().toISOString()
      })
      .eq('id', studentId);

    // 4. Update aggregated skills table
    // Delete old skills and batch insert new ones
    await supabaseAdmin.from('skills').delete().eq('student_id', studentId);
    
    if (result.skills && result.skills.length > 0) {
      const skillsToInsert = result.skills.map(s => ({
        student_id: studentId,
        name: s.name,
        status: s.status,
        repo_count: s.repoCount,
        evidence_strength: s.evidenceStrength
      }));

      const { error: insertErr } = await supabaseAdmin
        .from('skills')
        .insert(skillsToInsert);
      
      if (insertErr) {
        console.error('[fingerprint-generate] Skill insert error:', insertErr.message);
      }
    }

    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('[fingerprint-generate] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
