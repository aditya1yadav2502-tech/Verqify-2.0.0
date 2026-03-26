import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { generateSkillFingerprint } from '../../lib/githubApi';
import SkillFingerprint from '../../components/SkillFingerprint';
import { toast } from 'sonner';

export default function MyFingerprint() {
  const { session, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    async function fetchFingerprint() {
      if (!user || !supabase) return;
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
    if (!supabase || !user) {
      toast.error('Supabase not configured.');
      return;
    }

    if (!session?.provider_token) {
      toast.error('GitHub not connected. Redirecting to link your account...');
      // In a real app, we'd trigger OAuth here to link the account
      supabase.auth.signInWithOAuth({ 
        provider:'github', 
        options:{ 
          scopes:'repo read:user', 
          redirectTo:`${window.location.origin}/dashboard/fingerprint` 
        } 
      });
      return;
    }

    setLoading(true);
    const syncPromise = (async () => {
      const newFingerprint = await generateSkillFingerprint(session.provider_token);
      const { error } = await supabase
        .from('profiles')
        .update({ skill_fingerprint: newFingerprint })
        .eq('id', user.id);
      if (error) throw error;
      setFingerprint(newFingerprint);
      return newFingerprint;
    })();

    toast.promise(syncPromise, {
      loading: 'Analyzing GitHub repositories...',
      success: 'Engineering shape updated successfully!',
      error: 'Failed to sync GitHub data. Please try again.',
      finally: () => setLoading(false)
    });
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="label" style={{ marginBottom: '0.5rem' }}>Core Identity</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Skill Fingerprint.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>The mathematical representation of your engineering impact.</p>
      </header>

      <div className="glass" style={{ padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03), transparent)', pointerEvents: 'none' }} />
        
        {fingerprint ? (
          <>
            <div className="animate-fade-in-up">
              <SkillFingerprint skills={fingerprint} size={420} />
            </div>
            <div style={{ marginTop: '4rem', position: 'relative', zIndex: 1 }}>
              <button onClick={handleSync} disabled={loading} className="btn btn-secondary" style={{ padding: '0.85rem 2.5rem' }}>
                {loading ? 'Analyzing...' : 'Refresh from GitHub'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ maxWidth: 480, position: 'relative', zIndex: 1 }}>
            <div className="animate-pulse" style={{ width: 120, height: 120, margin: '0 auto 2.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'var(--accent-indigo)' }}>
              ✦
            </div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 600, marginBottom: '1.25rem' }}>No Shape Detected</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              We haven't mapped your engineering capability yet. Connect your GitHub repositories to generate your unique verified fingerprint.
            </p>
            <button onClick={handleSync} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
              {loading ? 'Connecting...' : 'Generate Fingerprint →'}
            </button>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>The Methodology</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            Our engine scans commit density, deployment surfaces, and dependency graphs. It doesn't just look for "keywords"—it identifies the actual architectural decisions you've shipped.
          </p>
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>Verification Grade</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            Every data point in your fingerprint is cryptographically linked to a GitHub commit SHA. Companies can click any node in your public profile to see the exact code that proved the skill.
          </p>
        </div>
      </div>
    </div>
  );
}
