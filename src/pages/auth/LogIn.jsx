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

const GoogleIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LogIn() {
  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleLogIn = async (e) => {
    e.preventDefault();
    if (!supabase) { toast.error("Supabase not connected. check .env"); return; }
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Welcome back!');
      window.location.href = '/dashboard';
    }
  };

  const handleGoogle = async () => {
    if (!supabase) { toast.warning('Supabase not configured. Using demo mode.'); window.location.href = '/dashboard'; return; }
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: `${window.location.origin}/dashboard` } 
    });
  };

  const handleGithub = async () => {
    if (!supabase) { toast.warning('Supabase not configured. Using demo mode.'); window.location.href = '/dashboard'; return; }
    await supabase.auth.signInWithOAuth({ 
      provider: 'github', 
      options: { scopes: 'repo read:user', redirectTo: `${window.location.origin}/dashboard` } 
    });
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Welcome Back.
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Log in to your Verqify profile.
      </p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }} onSubmit={handleLogIn}>
        <input
          className="input"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={set('email')}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={set('password')}
          required
        />
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Logging in...' : 'Sign In →'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div className="divider" style={{ flex: 1, margin: 0 }} />
        <span className="label">or continue with</span>
        <div className="divider" style={{ flex: 1, margin: 0 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button onClick={handleGoogle} className="btn btn-secondary" style={{ width: '100%', gap: '0.75rem', justifyContent:'center' }}>
          <GoogleIcon /> Google
        </button>
        <button onClick={handleGithub} className="btn btn-secondary" style={{ width: '100%', gap: '0.75rem', justifyContent:'center' }}>
          <GithubIcon /> GitHub
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        No account? <Link to="/signup" style={{ color: 'var(--accent-indigo)', fontWeight: 500 }}>Sign Up</Link>
      </p>
    </div>
  );
}
