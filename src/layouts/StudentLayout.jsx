import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const links = [
  { name: 'Dashboard',          path: '/dashboard' },
  { name: 'Build Profile',      path: '/dashboard/profile' },
  { name: 'My Fingerprint',     path: '/dashboard/fingerprint' },
  { name: 'Proof & Verification',path: '/dashboard/proof' },
  { name: 'Analytics',          path: '/dashboard/analytics' },
  { name: 'Settings',           path: '/dashboard/settings' },
];

export default function StudentLayout() {
  const { pathname } = useLocation();
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg-base)' }}>
      <aside style={{ width:260, borderRight:'1px solid var(--border)', background:'var(--bg-surface)', padding:'2rem 1.5rem', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <Link to="/" style={{ display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'3rem' }}>
          <div style={{ width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366F1,#06B6D4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:'700',color:'#fff',fontFamily:'var(--font-head)' }}>V</div>
          <span style={{ fontFamily:'var(--font-head)',fontWeight:700 }}>Verqify</span>
        </Link>
        <nav style={{ display:'flex',flexDirection:'column',gap:'0.25rem',flex:1 }}>
          <span className="label" style={{ marginBottom:'0.75rem' }}>Navigation</span>
          {links.map(l => {
            const active = pathname === l.path;
            return <Link key={l.path} to={l.path} style={{
              padding:'0.7rem 0.9rem', borderRadius:'var(--radius-sm)', fontSize:'0.9rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--accent-indigo)' : 'var(--text-secondary)',
              background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
              borderLeft: active ? '2px solid var(--accent-indigo)' : '2px solid transparent',
              transition:'all 0.2s',
            }}>{l.name}</Link>;
          })}
        </nav>
        <div style={{ borderTop:'1px solid var(--border)',paddingTop:'1.5rem' }}>
          <Link to="/s/me" style={{ fontSize:'0.85rem',color:'var(--text-muted)' }}>View Public Profile →</Link>
        </div>
      </aside>
      <main className="animate-fade-in" style={{ flex:1,padding:'3.5rem 5rem',overflow:'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
