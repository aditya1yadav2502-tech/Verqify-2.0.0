import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

const authRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin;

export default function SignUp() {
  const [step, setStep] = React.useState(1); // 1: details, 2: OTP
  const [form, setForm] = React.useState({
    collegeEmail: '',
    password: '',
    githubUrl: '',
    fullName: '',
    college: '',
    branch: 'CSE',
    yearOfStudy: '1st',
  });
  const [loading, setLoading] = React.useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const extractGithubUsername = (url) => {
    const match = url.trim().match(/^https?:\/\/(www\.)?github\.com\/([A-Za-z0-9-]+)\/?$/i);
    return match?.[2] ?? null;
  };

  const isCollegeEmail = (email) => /@.+\.(edu|ac\.[a-z]{2,})$/i.test(email.trim());

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!supabase) { toast.error('Supabase not connected. Check .env'); return; }
    if (!form.fullName.trim()) { toast.error('Please enter your full name'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    const normalizedEmail = form.collegeEmail.trim().toLowerCase();
    const githubUsername = form.githubUrl.trim() ? extractGithubUsername(form.githubUrl) : null;

    if (!isCollegeEmail(normalizedEmail)) {
      toast.error('Use a valid college email ID (e.g. name@college.edu)');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: form.password,
      options: {
        data: { 
          full_name: form.fullName.trim(),
          college: form.college.trim(),
          github_username: githubUsername || undefined 
        }
      }
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      if (data?.user?.id) {
        // Create profile early
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: form.fullName.trim(),
          college: form.college.trim(),
          branch: form.branch,
          year_of_study: form.yearOfStudy,
          github_username: githubUsername || null,
          updated_at: new Date().toISOString(),
        });
      }
      toast.success('Registration successful! Please check your email for verification.');
      window.location.href = '/dashboard';
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Join Verqify.
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Create an account with your official College Email.
      </p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSignUp}>
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
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
          <select className="input" value={form.branch} onChange={set('branch')}>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
            <option value="EE">EE</option>
          </select>
          <select className="input" value={form.yearOfStudy} onChange={set('yearOfStudy')}>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>

        {/* Auth fields */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
        <input
          className="input"
          type="email"
          placeholder="College Email ID"
          value={form.collegeEmail}
          onChange={set('collegeEmail')}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={set('password')}
          required
        />
        <input
          className="input"
          type="url"
          placeholder="GitHub URL (optional)"
          value={form.githubUrl}
          onChange={set('githubUrl')}
        />
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Creating Account...' : 'Get Verified →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 500 }}>Log In</Link>
      </p>
    </div>
  );
}
