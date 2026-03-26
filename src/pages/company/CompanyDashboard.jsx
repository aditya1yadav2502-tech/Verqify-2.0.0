import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';
import SkillFingerprint from '../../components/SkillFingerprint';

async function saveCandidate(studentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return toast.error('Please log in.');
  
  const { error } = await supabase
    .from('saved_candidates')
    .insert({ company_id: user.id, student_id: studentId });
  
  if (error) {
    if (error.code === '23505') toast.info('Candidate already in your shortlist.');
    else toast.error(error.message);
  } else {
    toast.success('Candidate saved to shortlist.');
  }
}

function ConfidenceBadge({ level }) {
  const cfg = {
    high:     { bg: '#dcfce7', color: '#166534', label: '🟢 High Confidence' },
    moderate: { bg: '#fef9c3', color: '#854d0e', label: '🟡 Moderate Confidence' },
    low:      { bg: '#fee2e2', color: '#991b1b', label: '🔴 Low Confidence' },
  }[level] || { bg: '#f3f4f6', color: '#6b7280', label: 'Unrated' };
  return (
    <span style={{
      padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.7rem',
      fontWeight: 700, background: cfg.bg, color: cfg.color,
      letterSpacing: '0.03em',
    }}>{cfg.label}</span>
  );
}

function CandidateCard({ studentId, username, headline, fingerprint, engineerType, confidenceLevel }) {
  // Extract top 3 skills from the radar data
  const topSkills = Array.isArray(fingerprint) 
    ? [...fingerprint].sort((a,b) => b.score - a.score).slice(0, 3).map(s => s.name)
    : ['Engineering'];

  return (
    <div className="glass" style={{ padding:'2rem',display:'flex',gap:'2.5rem',alignItems:'center' }}>
      <div style={{ width:110,height:110,background:'var(--bg-elevated)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative' }}>
        <SkillFingerprint skills={fingerprint || []} size={100} />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h3 style={{ margin:0,fontSize:'1.1rem',fontWeight:600 }}>@{username || 'anonymous'}</h3>
          <ConfidenceBadge level={confidenceLevel} />
        </div>
        {engineerType && (
          <div style={{ fontSize:'0.75rem', fontWeight: 700, color: 'var(--accent-indigo)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{engineerType}</div>
        )}
        <p style={{ color:'var(--text-secondary)',fontSize:'0.9rem',marginBottom:'1rem',lineHeight:1.4 }}>{headline || "Verified engineering candidate."}</p>
        <div style={{ display:'flex',gap:'0.6rem',flexWrap:'wrap' }}>
          {topSkills.map(s => <span key={s} className="badge badge-indigo" style={{ fontSize:'0.7rem' }}>{s}</span>)}
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',flexShrink:0 }}>
        <a href={`/s/${username}`} className="btn btn-primary" style={{ padding:'0.7rem 1.75rem',fontSize:'0.85rem',textAlign:'center',textDecoration:'none' }}>View Profile</a>
        <button onClick={() => saveCandidate(studentId)} className="btn btn-secondary" style={{ padding:'0.7rem 1.75rem',fontSize:'0.85rem' }}>Save Candidate</button>
      </div>
    </div>
  );
}


export default function CompanyDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Skill Shapes');

  useEffect(() => {
    async function fetchCandidates() {
      if (!supabase) return;
      setLoading(true);
      
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_discoverable', true);

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,bio.ilike.%${search}%,username.ilike.%${search}%`);
      }
      
      const { data } = await query.limit(10);
      
      let filtered = data || [];
      // Client side filtering for complex JSON patterns
      if (filter === 'High Confidence') {
        filtered = filtered.filter(c => {
          const dims = c.dimension_scores || {};
          const avg = Object.keys(dims).length > 0
            ? Math.round(Object.values(dims).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / Object.keys(dims).length)
            : 0;
          return avg >= 60;
        });
      } else if (filter === 'Moderate+ Confidence') {
        filtered = filtered.filter(c => {
          const dims = c.dimension_scores || {};
          const avg = Object.keys(dims).length > 0
            ? Math.round(Object.values(dims).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / Object.keys(dims).length)
            : 0;
          return avg >= 40;
        });
      } else if (filter === 'Backend Heavy') {
        filtered = filtered.filter(c => {
          const backend = c.skill_fingerprint?.find(s => s.name === 'Backend')?.score || 0;
          return backend > 60;
        });
      } else if (filter === 'Frontend Focused') {
        filtered = filtered.filter(c => {
          const frontend = c.skill_fingerprint?.find(s => s.name === 'Frontend')?.score || 0;
          return frontend > 60;
        });
      }
      
      setCandidates(filtered);
      setLoading(false);
    }
    const timeout = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timeout);
  }, [search, filter]);

  return (
    <div style={{ maxWidth:1040 }}>
      <header style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'4rem',flexWrap:'wrap',gap:'2rem' }}>
        <div>
          <div className="label" style={{ marginBottom:'0.5rem' }}>Recruiter Terminal</div>
          <h1 style={{ fontFamily:'var(--font-head)',fontSize:'3rem',fontWeight:700 }}>Discover Talent.</h1>
          <p style={{ color:'var(--text-secondary)',fontSize:'1.1rem',marginTop:'0.5rem' }}>Search engineers by their unique engineering fingerprint.</p>
        </div>
        <div style={{ display:'flex',gap:'1rem',alignItems:'center' }}>
          <select 
            className="input" 
            style={{ width:'auto',minWidth:180 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All Skill Shapes</option>
            <option>Backend Heavy</option>
            <option>Frontend Focused</option>
            <option>High Confidence</option>
            <option>Moderate+ Confidence</option>
          </select>
          <input 
            className="input" 
            placeholder="Search by keywords..." 
            style={{ width:280 }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>
      
      <div style={{ display:'flex',flexDirection:'column',gap:'1.5rem' }}>
        <div style={{ borderLeft:'4px solid var(--accent-indigo)',paddingLeft:'2rem' }}>
          <h2 style={{ fontFamily:'var(--font-head)',fontSize:'1.1rem',fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'1.5rem' }}>
            {candidates.length} Verified Candidates
          </h2>
          
          {loading ? (
            <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)' }}>Analyzing live talent pool...</div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:'1.25rem' }}>
              {candidates.length > 0 ? candidates.map(c => {
                // Compute confidence from dimension scores
                const dims = c.dimension_scores || {};
                const numericDims = Object.values(dims).filter(v => typeof v === 'number');
                const avg = numericDims.length > 0 ? Math.round(numericDims.reduce((a,b) => a+b, 0) / numericDims.length) : 0;
                const conf = avg >= 60 ? 'high' : avg >= 40 ? 'moderate' : 'low';
                return (
                  <CandidateCard 
                    key={c.id}
                    studentId={c.id}
                    username={c.username}
                    headline={c.bio}
                    fingerprint={c.skill_fingerprint}
                    engineerType={c.engineer_type}
                    confidenceLevel={conf}
                  />
                );
              }) : (
                <div className="glass" style={{ padding:'3rem', textAlign:'center' }}>
                  <p style={{ color:'var(--text-secondary)' }}>No live profiles found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

