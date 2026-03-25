import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { generateSkillFingerprint } from '../../lib/githubApi';
import SkillFingerprint from '../../components/SkillFingerprint';

export default function MyFingerprint() {
  const { session, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchFingerprint() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('skill_fingerprint')
        .eq('id', user.id)
        .single();
      
      if (data?.skill_fingerprint) {
        setFingerprint(data.skill_fingerprint);
      }
    }
    fetchFingerprint();
  }, [user]);

  const handleSync = async () => {
    if (!session?.provider_token) {
      setMessage('No GitHub token found. Please try re-logging in with GitHub.');
      return;
    }

    setLoading(true);
    setMessage('Analyzing your GitHub history...');
    
    try {
      const newFingerprint = await generateSkillFingerprint(session.provider_token);
      
      const { error } = await supabase
        .from('profiles')
        .update({ skill_fingerprint: newFingerprint })
        .eq('id', user.id);

      if (error) throw error;
      
      setFingerprint(newFingerprint);
      setMessage('Successfully synced! Your engineering shape has been updated.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to sync. Make sure you granted repo access during GitHub login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <header className="mb-8">
        <h1 className="title-section" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>My Fingerprint.</h1>
        <p className="text-secondary" style={{ fontSize: '1.125rem' }}>Your engineering identity, calculated from your real work.</p>
      </header>

      <div className="card" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'var(--color-bg-alt)' }}>
        {fingerprint ? (
          <>
            <SkillFingerprint skills={fingerprint} size={400} />
            <div style={{ marginTop: '3rem' }}>
              <button onClick={handleSync} disabled={loading} className="btn btn-outline" style={{ padding: '1rem 2rem' }}>
                {loading ? 'Re-analyzing...' : 'Refresh from GitHub'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ maxWidth: '400px' }}>
            <div style={{ width: '100px', height: '100px', margin: '0 auto 2rem', border: '2px dashed var(--color-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>?</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>No Data Yet</h2>
            <p className="text-secondary mb-8">We haven't analyzed your code yet. Connect your GitHub repositories to reveal your engineering shape.</p>
            <button onClick={handleSync} disabled={loading} className="btn btn-accent" style={{ width: '100%', padding: '1.25rem' }}>
              {loading ? 'Analyzing...' : 'Generate Fingerprint'}
            </button>
          </div>
        )}
        {message && <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-accent)' }}>{message}</p>}
      </div>
      
      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>How is this calculated?</h2>
        <p className="text-secondary" style={{ lineHeight: '1.8' }}>
          Our algorithm scans your public repositories and contributions. It measures the density of your work in specific domains (Backend, Frontend, etc.) and looks for evidence of architectural complexity, system design, and consistent shipping behavior.
        </p>
      </div>
    </div>
  );
}
