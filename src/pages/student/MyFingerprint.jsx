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
    async function init() {
      if (!user || !supabase) return;
      
      // 1. Fetch existing fingerprint
      const { data } = await supabase
        .from('profiles')
        .select('skill_fingerprint')
        .eq('id', user.id)
        .single();
      
      if (data?.skill_fingerprint) {
        setFingerprint(data.skill_fingerprint);
      } else if (session?.provider_token) {
        handleSync();
      }
    }
    init();
  }, [user, session]);

  const handleSync = async () => {
    if (!supabase || !user) {
      toast.error('Supabase not configured.');
      return;
    }

    const token = session?.provider_token || 'demo_token';

    setLoading(true);
    const syncPromise = (async () => {
      const result = await generateSkillFingerprint(token);
      const { radarData, aiInfo } = result;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          skill_fingerprint: radarData,
          ai_personality: aiInfo.personality,
          dimension_scores: aiInfo.dimensions,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      setFingerprint(radarData);
      // Refresh local profile state from Supabase or reload
      setTimeout(() => window.location.reload(), 2000); 
      return result;
    })();

    toast.promise(syncPromise, {
      loading: 'Gemini AI is synthesizing your engineering identity...',
      success: 'Engineering signature verified and personality mapped!',
      error: 'Analysis incomplete. Checking AI quotas...',
      finally: () => setLoading(false)
    });
  };

  const { profile } = useAuth();

  return (
    <div style={{ maxWidth: 960 }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="label" style={{ marginBottom: '0.5rem' }}>Core Identity</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Skill Fingerprint.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>The mathematical representation of your engineering impact, verified by Gemini AI.</p>
      </header>

      <div className="glass" style={{ padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03), transparent)', pointerEvents: 'none' }} />
        
        {fingerprint ? (
          <>
            <div className="animate-fade-in-up">
              <SkillFingerprint skills={fingerprint} size={420} />
            </div>

            {profile?.ai_personality && (
              <div className="animate-fade-in-up" style={{ marginTop: '4rem', maxWidth: 650, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>AI Perspective</div>
                <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-head)', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                   "{profile.ai_personality}"
                </p>
              </div>
            )}

            {profile?.dimension_scores && (
              <div className="animate-fade-in-up" style={{ 
                marginTop: '4rem', width: '100%', maxWidth: 800, 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem',
                position: 'relative', zIndex: 1 
              }}>
                {Object.entries(profile.dimension_scores).map(([key, score]) => (
                  <div key={key} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{key}</div>
                    <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-head)' }}>{score}</div>
                    <div style={{ height: 2, background: 'var(--bg-elevated)', marginTop: '0.5rem', borderRadius: 1 }}>
                      <div style={{ height: '100%', width: `${score}%`, background: 'var(--accent-indigo)', borderRadius: 1 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '5rem', position: 'relative', zIndex: 1 }}>
              <button onClick={handleSync} disabled={loading} className="btn btn-secondary" style={{ padding: '0.85rem 2.5rem' }}>
                {loading ? 'Re-analyzing...' : 'Refresh from GitHub'}
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
