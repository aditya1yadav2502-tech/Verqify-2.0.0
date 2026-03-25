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
  const [step, setStep] = React.useState(1); // 1: ID, 2: OTP
  const [collegeId, setCollegeId] = React.useState('');

  const handleGithub = async () => {
    if (!supabase) { console.warn('Supabase not configured — running in demo mode.'); window.location.href = '/dashboard'; return; }
    await supabase.auth.signInWithOAuth({ provider:'github', options:{ scopes:'repo read:user', redirectTo:`${window.location.origin}/dashboard` } });
  };
  return (
    <div>
      <h1 style={{ fontFamily:'var(--font-head)',fontSize:'2rem',fontWeight:700,marginBottom:'0.5rem' }}>Join Verqify.</h1>
      <p style={{ color:'var(--text-secondary)',marginBottom:'2rem' }}>Sign up using your official College ID.</p>
      <form style={{ display:'flex',flexDirection:'column',gap:'1rem' }} onSubmit={e=>{e.preventDefault(); if(step===1) setStep(2); else window.location.href='/dashboard';}}>
        {step === 1 ? (
          <>
            <input className="input" type="text" placeholder="Enter College ID" value={collegeId} onChange={e=>setCollegeId(e.target.value)} required />
            <button type="submit" className="btn btn-primary" style={{ width:'100%' }}>Send OTP</button>
          </>
        ) : (
          <>
            <div style={{ textAlign:'center', marginBottom:'0.5rem' }}>
              <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>OTP sent to registered mobile/email for <b>{collegeId}</b></span>
            </div>
            <input className="input" type="text" placeholder="Enter 6-digit OTP" maxLength={6} required />
            <button type="submit" className="btn btn-primary" style={{ width:'100%' }}>Verify & Join</button>
            <button type="button" onClick={()=>setStep(1)} className="btn btn-ghost" style={{ fontSize:'0.8rem' }}>Change ID</button>
          </>
        )}
      </form>
      <p style={{ textAlign:'center',marginTop:'1.75rem',fontSize:'0.85rem',color:'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color:'var(--accent-indigo)',fontWeight:500 }}>Log In</Link>
      </p>
    </div>
  );
}
