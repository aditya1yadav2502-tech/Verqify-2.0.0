import React from 'react';
import SkillFingerprint from '../../components/SkillFingerprint';

const s1 = [{name:'Backend',score:92},{name:'Database',score:80},{name:'DevOps',score:60},{name:'Frontend',score:40},{name:'Arch',score:75}];
const s2 = [{name:'Backend',score:45},{name:'Database',score:50},{name:'DevOps',score:30},{name:'Frontend',score:90},{name:'Arch',score:60}];

function CandidateCard({ name, headline, skills, match, fingerprint }) {
  return (
    <div className="glass" style={{ padding:'2rem',display:'flex',gap:'2.5rem',alignItems:'center' }}>
      <div style={{ width:110,height:110,background:'var(--bg-elevated)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative' }}>
        <SkillFingerprint skills={fingerprint} size={100} />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem' }}>
          <h3 style={{ fontFamily:'var(--font-head)',fontSize:'1.25rem',fontWeight:700 }}>{name}</h3>
          <span className="badge badge-cyan" style={{ fontSize:'0.7rem' }}>{match} Match</span>
        </div>
        <p style={{ color:'var(--text-secondary)',fontSize:'0.95rem',marginBottom:'1rem',lineHeight:1.5 }}>{headline}</p>
        <div style={{ display:'flex',gap:'0.6rem',flexWrap:'wrap' }}>
          {skills.map(s => <span key={s} className="badge badge-green" style={{ fontSize:'0.75rem' }}>{s} · Verified</span>)}
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
          <div style={{ display:'flex',flexDirection:'column',gap:'1.25rem' }}>
            <CandidateCard name="Aditya Yadav" headline="Core backend architect. Specializes in distributed systems and PostgreSQL optimization." skills={['Node.js','PostgreSQL','Redis']} match="94%" fingerprint={s1} />
            <CandidateCard name="Sneha Reddy" headline="Frontend engineering lead. Expert in high-performance React and Design Systems." skills={['React','TypeScript','Tailwind']} match="89%" fingerprint={s2} />
          </div>
        </div>
      </div>
    </div>
  );
}
