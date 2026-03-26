import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

const authRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin;

const GithubIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function LogIn() {
  const [step, setStep] = React.useState(1); // 1: details, 2: OTP
  const [otp, setOtp] = React.useState('');
  const [form, setForm] = React.useState({
    collegeEmail: '',
    fullName: '',
    college: '',
    branch: 'CSE',
    yearOfStudy: '1st',
  });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isCollegeEmail = (email) => /@.+\.(edu|ac\.[a-z]{2,})$/i.test(email.trim());

  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!supabase) {
        toast.error("Supabase not connected. check .env");
        return;
      }
      if (!form.fullName.trim()) { toast.error('Please enter your full name'); return; }
      if (!form.college.trim()) { toast.error('Please enter your college name'); return; }

      const normalizedEmail = form.collegeEmail.trim().toLowerCase();
      if (!isCollegeEmail(normalizedEmail)) {
        toast.error('Use a valid college email ID (e.g. name@college.edu)');
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: authRedirectUrl,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`OTP sent to ${normalizedEmail}`);
        setStep(2);
      }
    } else {
      const { data, error } = await supabase.auth.verifyOtp({
        email: form.collegeEmail.trim().toLowerCase(),
        token: otp,
        type: 'email'
      });

      if (error) {
        toast.error(error.message);
      } else {
        if (data?.user?.id) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: form.fullName.trim(),
            college: form.college.trim(),
            branch: form.branch,
            year_of_study: form.yearOfStudy,
            updated_at: new Date().toISOString(),
          });
        }
        toast.success('Welcome back!');
        window.location.href = '/dashboard';
      }
    }
  };

  const handleGithub = async () => {
    if (!supabase) { console.warn('Supabase not configured — running in demo mode.'); window.location.href = '/dashboard'; return; }
    await supabase.auth.signInWithOAuth({ provider: 'github', options: { scopes: 'repo read:user', redirectTo: `${window.location.origin}/dashboard` } });
  };
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Welcome Back.
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Log in to your Verqify profile.
      </p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }} onSubmit={handleNext}>
        {step === 1 ? (
          <>
            {/* Identity fields */}
            <input
              className="input"
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              onChange={set('fullName')}
              required
            />
            <input
              className="input"
              type="text"
              placeholder="College / University"
              value={form.college}
              onChange={set('college')}
              required
            />
            <select className="input" value={form.branch} onChange={set('branch')}>
              <option value="CSE">CSE — Computer Science & Engineering</option>
              <option value="ECE">ECE — Electronics & Communication</option>
              <option value="IT">IT — Information Technology</option>
              <option value="ME">ME — Mechanical Engineering</option>
              <option value="CE">CE — Civil Engineering</option>
              <option value="EE">EE — Electrical Engineering</option>
              <option value="Other">Other</option>
            </select>
            <select className="input" value={form.yearOfStudy} onChange={set('yearOfStudy')}>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="Alumni">Alumni</option>
            </select>

            {/* Auth field */}
            <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
            <input
              className="input"
              type="email"
              placeholder="College Email ID"
              value={form.collegeEmail}
              onChange={set('collegeEmail')}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>Get OTP →</button>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Enter the code sent to <b>{form.collegeEmail}</b></span>
            </div>
            <input className="input" type="text" placeholder="6-digit OTP" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Verify & Login</button>
            <button type="button" onClick={() => setStep(1)} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>← Go back</button>
          </>
        )}
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="divider" style={{ flex: 1, margin: 0 }} />
        <span className="label">or</span>
        <div className="divider" style={{ flex: 1, margin: 0 }} />
      </div>

      <button onClick={handleGithub} className="btn btn-secondary" style={{ width: '100%', gap: '0.75rem' }}>
        <GithubIcon /> Log In with GitHub
      </button>
      <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        No account? <Link to="/signup" style={{ color: 'var(--accent-indigo)', fontWeight: 500 }}>Sign Up</Link>
      </p>
    </div>
  );
}
