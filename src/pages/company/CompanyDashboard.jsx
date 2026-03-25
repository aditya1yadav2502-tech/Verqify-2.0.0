import React from 'react';
import SkillFingerprint from '../../components/SkillFingerprint';

const s1 = [{name:'Backend',score:92},{name:'Database',score:80},{name:'DevOps',score:60},{name:'Frontend',score:40},{name:'Arch',score:75}];
const s2 = [{name:'Backend',score:45},{name:'Database',score:50},{name:'DevOps',score:30},{name:'Frontend',score:90},{name:'Arch',score:60}];

function CandidateCard({ name, headline, skills, match, fingerprint }) {
  return (
    <div className="glass" style={{ padding:'1.75rem',display:'flex',gap:'2rem',alignItems:'center' }}>
      <div style={{ width:100,height:100,background:'var(--bg-elevated)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
        <SkillFingerprint skills={fingerprint} size={90} />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.4rem' }}>
          <h3 style={{ fontFamily:'var(--font-head)',fontSize:'1.15rem',fontWeight:600 }}>{name}</h3>
          <span className="badge badge-cyan" style={{ fontSize:'0.65rem' }}>{match} Match</span>
        </div>
        <p style={{ color:'var(--text-secondary)',fontSize:'0.9rem',marginBottom:'0.75rem' }}>{headline}</p>
        <div style={{ display:'flex',gap:'0.5rem',flexWrap:'wrap' }}>
          {skills.map(s => <span key={s} className="badge badge-green" style={{ fontSize:'0.7rem' }}>{s} · Verified</span>)}
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',flexShrink:0 }}>
        <button className="btn btn-primary" style={{ padding:'0.65rem 1.25rem',fontSize:'0.85rem' }}>View Profile</button>
        <button className="btn btn-secondary" style={{ padding:'0.65rem 1.25rem',fontSize:'0.85rem' }}>Save</button>
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  return (
    <div style={{ maxWidth:1000 }}>
      <header style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'1rem' }}>
        <div>
          <div className="label" style={{ marginBottom:'0.5rem' }}>Company Dashboard</div>
          <h1 style={{ fontFamily:'var(--font-head)',fontSize:'2.5rem',fontWeight:700 }}>Discover Talent.</h1>
          <p style={{ color:'var(--text-secondary)',marginTop:'0.25rem' }}>Browse verified engineers by real engineering shape.</p>
        </div>
        <div style={{ display:'flex',gap:'0.75rem' }}>
          <select className="input" style={{ width:'auto',padding:'0.7rem 1rem' }}>
            <option>All Skill Shapes</option>
            <option>Backend Heavy</option>
            <option>Frontend Focused</option>
          </select>
          <input className="input" placeholder="Search by skill..." style={{ width:250 }} />
        </div>
      </header>
      <div style={{ display:'flex',flexDirection:'column',gap:'1.25rem' }}>
        <CandidateCard name="Aditya Yadav" headline="Backend engineer. Consistent shipper." skills={['Node.js','PostgreSQL']} match="92%" fingerprint={s1} />
        <CandidateCard name="Sneha Reddy" headline="Systems thinker. Rust enthusiast." skills={['Rust','WebAssembly']} match="88%" fingerprint={s2} />
      </div>
    </div>
  );
}
