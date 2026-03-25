import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const links = [
  { name: 'Browse Students',   path: '/company/dashboard' },
  { name: 'Saved Candidates',  path: '/company/saved'     },
  { name: 'Messages',          path: '/company/messages'  },
];

export default function CompanyLayout() {
  const { pathname } = useLocation();
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg-base)' }}>
      <aside style={{ width:260, borderRight:'1px solid var(--border)', background:'var(--bg-surface)', padding:'2rem 1.5rem', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <Link to="/" style={{ display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.5rem' }}>
          <div style={{ width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366F1,#06B6D4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:'700',color:'#fff',fontFamily:'var(--font-head)' }}>V</div>
          <span style={{ fontFamily:'var(--font-head)',fontWeight:700 }}>Verqify</span>
        </Link>
        <div className="badge badge-cyan" style={{ marginBottom:'3rem',alignSelf:'flex-start',fontSize:'0.65rem' }}>FOR TEAMS</div>
        <nav style={{ display:'flex',flexDirection:'column',gap:'0.25rem',flex:1 }}>
          <span className="label" style={{ marginBottom:'0.75rem' }}>Navigation</span>
          {links.map(l => {
            const active = pathname === l.path;
            return <Link key={l.path} to={l.path} style={{
              padding:'0.7rem 0.9rem', borderRadius:'var(--radius-sm)', fontSize:'0.9rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
              borderLeft: active ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              transition:'all 0.2s',
            }}>{l.name}</Link>;
          })}
        </nav>
        <div style={{ borderTop:'1px solid var(--border)',paddingTop:'1.5rem' }}>
          <Link to="/" style={{ fontSize:'0.85rem',color:'var(--text-muted)' }}>Log Out</Link>
        </div>
      </aside>
      <main className="animate-fade-in" style={{ flex:1,padding:'3.5rem 5rem',overflow:'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
