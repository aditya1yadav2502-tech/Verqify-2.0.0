import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const GithubIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function SignUp() {
  const handleGithub = async () => {
    if (!supabase) { console.warn('Supabase not configured — running in demo mode.'); window.location.href = '/dashboard'; return; }
    await supabase.auth.signInWithOAuth({ provider:'github', options:{ scopes:'repo read:user', redirectTo:`${window.location.origin}/dashboard` } });
  };
  return (
    <div>
      <div className="badge badge-indigo" style={{ marginBottom:'1.5rem' }}>Students only · Always free</div>
      <h1 style={{ fontFamily:'var(--font-head)',fontSize:'2rem',fontWeight:700,marginBottom:'0.5rem' }}>Get Verified.</h1>
      <p style={{ color:'var(--text-secondary)',marginBottom:'2rem' }}>Claim your engineering fingerprint.</p>
      <button onClick={handleGithub} className="btn btn-primary" style={{ width:'100%',marginBottom:'1.5rem',gap:'0.75rem' }}><GithubIcon /> Continue with GitHub</button>
      <div style={{ display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem' }}>
        <div className="divider" style={{ flex:1,margin:0 }} />
        <span className="label">or</span>
        <div className="divider" style={{ flex:1,margin:0 }} />
      </div>
      <form style={{ display:'flex',flexDirection:'column',gap:'1rem' }} onSubmit={e=>e.preventDefault()}>
        <input className="input" type="text" placeholder="Your Student ID" />
        <input className="input" type="password" placeholder="Create password" />
        <button type="submit" className="btn btn-secondary" style={{ width:'100%' }}>Continue with Student ID</button>
      </form>
      <p style={{ textAlign:'center',marginTop:'1.75rem',fontSize:'0.85rem',color:'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color:'var(--accent-indigo)',fontWeight:500 }}>Log In</Link>
      </p>
    </div>
  );
}
