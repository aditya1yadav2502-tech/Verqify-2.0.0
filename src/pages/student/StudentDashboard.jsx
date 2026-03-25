import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    }

    getProfile();
  }, [user]);

  if (loading) return <div className="container" style={{ paddingTop: '4rem' }}>Loading perspective...</div>;

  const fingerprint = profile?.skill_fingerprint || [];
  const verifiedCount = fingerprint.filter(s => s.score > 0).length;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header className="mb-8 pl-1">
        <h1 className="title-section" style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>
          Welcome, {profile?.full_name?.split(' ')[0] || 'Engineer'}.
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.125rem' }}>Your current Verqify profile status.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>Completeness</h3>
          <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', lineHeight: '1', marginBottom: '0.5rem' }}>
            {profile?.skill_fingerprint ? '100%' : '45%'}
          </div>
          <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
            {profile?.skill_fingerprint ? 'Profile is verified.' : 'Generate your fingerprint to reach 100%.'}
          </p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>Profile Views <span style={{ opacity: 0.5 }}>(30d)</span></h3>
          <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', lineHeight: '1', marginBottom: '0.5rem' }}>0</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-verified)', fontWeight: '500' }}>Active in discoverability</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>Verified Skills</h3>
          <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', lineHeight: '1', marginBottom: '0.5rem' }}>
            {verifiedCount} <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)' }}>tags</span>
          </div>
          <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Linked via GitHub data sync.</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Suggested Actions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!profile?.skill_fingerprint ? (
          <div className="card" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--color-accent)' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Generate Skill Fingerprint</h4>
              <p className="text-secondary" style={{ margin: 0, fontSize: '0.9rem' }}>We need to analyze your code history to build your engineering shape.</p>
            </div>
            <Link to="/dashboard/fingerprint" className="btn btn-accent" style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}>Sync GitHub</Link>
          </div>
        ) : (
          <div className="card" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Your profile is live</h4>
              <p className="text-secondary" style={{ margin: 0, fontSize: '0.9rem' }}>Recruiters can now discover your engineering shape.</p>
            </div>
            <Link to={`/s/${profile.username}`} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}>View Public Profile</Link>
          </div>
        )}
      </div>
    </div>
  );
}
