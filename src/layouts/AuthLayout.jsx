import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:500, background:'radial-gradient(closest-side, rgba(99,102,241,0.06), transparent)', pointerEvents:'none', borderRadius:'50%' }} />
      <header style={{ position:'absolute', top:'2rem', left:'2rem' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366F1,#06B6D4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:'700',color:'#fff',fontFamily:'var(--font-head)' }}>V</div>
          <span style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:'1.1rem' }}>Verqify</span>
        </Link>
      </header>
      <div className="glass animate-fade-in-up" style={{ width:'100%',maxWidth:420,padding:'2.75rem',borderRadius:24,zIndex:1 }}>
        <Outlet />
      </div>
    </div>
  );
}
