import React, { useState, useEffect } from 'react';
import SkillFingerprint from '../../components/SkillFingerprint';
import { supabase } from '../../lib/supabaseClient';

function CandidateCard({ name, headline, skills, match, fingerprint }) {
  const displaySkills = Array.isArray(skills) ? skills : [];
  const displayFingerprint = Array.isArray(fingerprint) ? fingerprint : [
    { name: 'Backend', score: 20 }, { name: 'Database', score: 20 }, 
    { name: 'DevOps', score: 20 }, { name: 'Frontend', score: 20 }, { name: 'Architecture', score: 20 }
  ];
  return (
    <div className="glass" style={{ padding:'2rem',display:'flex',gap:'2.5rem',alignItems:'center' }}>
      <div style={{ width:110,height:110,background:'var(--bg-elevated)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative' }}>
        <SkillFingerprint skills={fingerprint} size={100} />
      </div>
      <div style={{ flex:1 }}>
        <p style={{ color:'var(--text-secondary)',fontSize:'0.95rem',marginBottom:'1rem',lineHeight:1.5 }}>{headline || "Verified engineering candidate."}</p>
        <div style={{ display:'flex',gap:'0.6rem',flexWrap:'wrap' }}>
          {displaySkills.slice(0, 4).map(s => <span key={s} className="badge badge-green" style={{ fontSize:'0.75rem' }}>{s} · Verified</span>)}
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',flexShrink:0 }}>
        <button className="btn btn-primary" style={{ padding:'0.75rem 1.75rem',fontSize:'0.9rem' }}>View Profile</button>
        <button className="btn btn-secondary" style={{ padding:'0.75rem 1.75rem',fontSize:'0.9rem' }}>Save Candidate</button>
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidates() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_discoverable', true)
        .limit(10);
      
      if (data) setCandidates(data);
      setLoading(false);
    }
    fetchCandidates();
  }, []);

  return (
    <div style={{ maxWidth:1040 }}>
      <header style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'4rem',flexWrap:'wrap',gap:'2rem' }}>
        <div>
          <div className="label" style={{ marginBottom:'0.5rem' }}>Recruiter Terminal</div>
          <h1 style={{ fontFamily:'var(--font-head)',fontSize:'3rem',fontWeight:700 }}>Discover Talent.</h1>
          <p style={{ color:'var(--text-secondary)',fontSize:'1.1rem',marginTop:'0.5rem' }}>Search engineers by their unique engineering fingerprint.</p>
        </div>
        <div style={{ display:'flex',gap:'1rem',alignItems:'center' }}>
          <select className="input" style={{ width:'auto',minWidth:180 }}>
            <option>All Skill Shapes</option>
            <option>Backend Heavy</option>
            <option>Frontend Focused</option>
            <option>Full Stack Balanced</option>
          </select>
          <input className="input" placeholder="Search by skill (e.g. Rust)..." style={{ width:280 }} />
        </div>
      </header>
      
      <div style={{ display:'flex',flexDirection:'column',gap:'1.5rem' }}>
        <div style={{ borderLeft:'4px solid var(--accent-indigo)',paddingLeft:'2rem' }}>
          <h2 style={{ fontFamily:'var(--font-head)',fontSize:'1.1rem',fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'1.5rem' }}>Top Matches</h2>
          
          {loading ? (
            <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)' }}>Analyzing live talent pool...</div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:'1.25rem' }}>
              {candidates.length > 0 ? candidates.map(c => (
                <CandidateCard 
                  key={c.id}
                  name={c.full_name} 
                  headline={c.bio}
                  skills={[]} // In a real app we'd compute this from the fingerprint
                  match={Math.floor(Math.random() * 20 + 80) + "%"}
                  fingerprint={c.skill_fingerprint} 
                />
              )) : (
                <div className="glass" style={{ padding:'3rem', textAlign:'center' }}>
                  <p style={{ color:'var(--text-secondary)' }}>No live profiles found yet. Invite students to claim their shapes.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
