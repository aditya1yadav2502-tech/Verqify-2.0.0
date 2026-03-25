import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0',
      background: 'rgba(250,251,255,0.85)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:'700', color:'#fff', fontFamily:'var(--font-head)' }}>V</div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Verqify</span>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/"                  className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Home</Link>
          <Link to="/dashboard"         className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Dashboard</Link>
          <Link to="/company/dashboard" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Explore</Link>
          <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 0.5rem' }} />
          <Link to="/login"  className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Log In</Link>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>Get Verified →</Link>
        </div>
      </div>
    </nav>
  );
}
