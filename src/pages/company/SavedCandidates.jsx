import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';

export default function SavedCandidates() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSaved() {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('saved_candidates')
      .select(`
        id,
        profiles:student_id (
          id,
          username,
          full_name,
          bio,
          skill_fingerprint
        )
      `)
      .eq('company_id', user.id);
    
    if (data) setSaved(data);
    setLoading(false);
  }

  useEffect(() => {
    const init = async () => {
      await fetchSaved();
    };
    init();
  }, []);

  const handleRemove = async (id) => {
    const { error } = await supabase
      .from('saved_candidates')
      .delete()
      .eq('id', id);
    
    if (error) toast.error(error.message);
    else {
      toast.success('Candidate removed from shortlist');
      setSaved(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Shortlist.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginTop: '0.5rem' }}>Verified candidates you have prioritized for upcoming roles.</p>
      </header>

      {loading ? (
         <div style={{ color: 'var(--text-muted)' }}>Retrieving your shortlist...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {saved.length > 0 ? saved.map(item => {
            const student = item.profiles;
            const topSkills = Array.isArray(student.skill_fingerprint) 
              ? [...student.skill_fingerprint].sort((a,b) => b.score - a.score).slice(0, 2).map(s => s.name)
              : ['Engineering'];

            return (
              <div key={item.id} className="glass" style={{ padding: '2rem', position: 'relative' }}>
                <button 
                  onClick={() => handleRemove(item.id)}
                  style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>{student.full_name || `@${student.username}`}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', minHeight: '3em' }}>
                  {student.bio || 'Verified engineer with a unique capability shape.'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  {topSkills.map(s => (
                    <span key={s} className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href={`/s/${student.username}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: '0.85rem' }}>Profile</a>
                  <button className="btn btn-primary" style={{ flex: 1.5, fontSize: '0.85rem' }}>Message</button>
                </div>
              </div>
            );
          }) : (
            <div className="glass" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Your shortlist is empty. Discover candidates via the recruiter terminal.</p>
              <a href="/company/dashboard" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>Go to Discovery</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

