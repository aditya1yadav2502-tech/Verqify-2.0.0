import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

function StatCard({ num, label, trend }) {
  return (
    <div className="glass" style={{ padding:'2rem' }}>
      <div className="label" style={{ marginBottom:'0.75rem' }}>{label}</div>
      <div className="gradient-text" style={{ fontFamily:'var(--font-head)',fontSize:'3rem',fontWeight:700,lineHeight:1,marginBottom:'0.5rem' }}>{num}</div>
      {trend && <p style={{ fontSize:'0.8rem',color:'var(--accent-green)',fontWeight:600 }}>{trend}</p>}
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  const name = profile?.full_name?.split(' ')[0] || (user ? 'Engineer' : 'Preview');

  return (
    <div style={{ maxWidth:960 }}>
      <header style={{ marginBottom:'3rem' }}>
        <div className="label" style={{ marginBottom:'0.5rem' }}>Student Dashboard</div>
        <h1 style={{ fontFamily:'var(--font-head)',fontSize:'2.5rem',fontWeight:700 }}>Welcome, {name}.</h1>
        <p style={{ color:'var(--text-secondary)',marginTop:'0.25rem' }}>Your Verqify profile at a glance.</p>
      </header>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'1.25rem',marginBottom:'3rem' }}>
        <StatCard num={profile?.skill_fingerprint ? '100%' : '45%'} label="Completeness" trend={profile?.skill_fingerprint ? '✓ Fully verified' : undefined} />
        <StatCard num="0" label="Profile Views (30d)" trend="↗ Discoverable" />
        <StatCard num={profile?.skill_fingerprint?.filter(s=>s.score>0).length || 0} label="Verified Skills" />
      </div>
      <h2 style={{ fontFamily:'var(--font-head)',fontSize:'1.25rem',fontWeight:600,marginBottom:'1.25rem' }}>Suggested Actions</h2>
      {!profile?.skill_fingerprint ? (
        <div className="glass" style={{ padding:'1.5rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',borderLeft:'3px solid var(--accent-indigo)' }}>
          <div>
            <h3 style={{ fontFamily:'var(--font-head)',marginBottom:'0.4rem' }}>Generate Skill Fingerprint</h3>
            <p style={{ color:'var(--text-secondary)',fontSize:'0.9rem' }}>Analyze your GitHub history to reveal your engineering shape.</p>
          </div>
          <Link to="/dashboard/fingerprint" className="btn btn-primary" style={{ whiteSpace:'nowrap' }}>Sync GitHub →</Link>
        </div>
      ) : (
        <div className="glass" style={{ padding:'1.5rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div>
            <h3 style={{ fontFamily:'var(--font-head)',marginBottom:'0.4rem' }}>Profile is live</h3>
            <p style={{ color:'var(--text-secondary)',fontSize:'0.9rem' }}>Recruiters can discover your engineering shape.</p>
          </div>
          <Link to={`/s/${profile?.username}`} className="btn btn-secondary" style={{ whiteSpace:'nowrap' }}>View Public Profile →</Link>
        </div>
      )}
    </div>
  );
}
