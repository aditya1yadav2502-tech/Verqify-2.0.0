import { supabase } from './supabaseClient';

export async function lookupStudent(collegeId) {
  if (!supabase || !collegeId) return null;

  const normalizedCollegeId = collegeId.trim().toUpperCase();
  const { data, error } = await supabase
    .from('student_registry')
    .select('college_id, full_name, college, major, year, avatar_url')
    .eq('college_id', normalizedCollegeId)
    .maybeSingle();

  if (error) {
    console.error('Failed to lookup student registry record:', error.message);
    return null;
  }

  return data ?? null;
}
