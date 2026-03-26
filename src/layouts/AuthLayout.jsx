import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="mesh-gradient" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Glows */}
      <div style={{ position:'absolute', top:'-10%', right:'-10%', width:600, height:600, background:'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'-10%', width:600, height:600, background:'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />
      
      <header style={{ position:'absolute', top:'2.5rem', left:'2.5rem' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#6366F1,#4F46E5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:'800',color:'#fff',fontFamily:'var(--font-head)',boxShadow:'0 4px 12px rgba(99,102,241,0.2)' }}>V</div>
          <span style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:'1.25rem',letterSpacing:'-0.02em' }}>Verqify</span>
        </Link>
      </header>
      
      <div className="glass animate-fade-in-up" style={{ 
        width:'100%', 
        maxWidth:440, 
        padding:'3.5rem', 
        borderRadius:32, 
        zIndex:1,
        boxShadow:'0 32px 64px rgba(0,0,0,0.06), 0 16px 32px rgba(99,102,241,0.03)',
        border: '1px solid rgba(255,255,255,0.8)'
      }}>
        <Outlet />
      </div>

      <div style={{ position:'absolute', bottom:'2.5rem', color:'var(--text-muted)', fontSize:'0.85rem', fontWeight:500 }}>
        The New Proof-of-Work Standards.
      </div>
    </div>
  );
}
