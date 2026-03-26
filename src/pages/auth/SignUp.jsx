import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

const authRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin;

export default function SignUp() {
  const [step, setStep] = React.useState(1); // 1: details, 2: OTP
  const [form, setForm] = React.useState({
    collegeEmail: '',
    githubUrl: '',
    fullName: '',
    college: '',
    branch: 'CSE',
    yearOfStudy: '1st',
  });
  const [otp, setOtp] = React.useState('');

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const extractGithubUsername = (url) => {
    const match = url.trim().match(/^https?:\/\/(www\.)?github\.com\/([A-Za-z0-9-]+)\/?$/i);
    return match?.[2] ?? null;
  };

  const isCollegeEmail = (email) => /@.+\.(edu|ac\.[a-z]{2,})$/i.test(email.trim());

  const handleNext = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!supabase) { toast.error('Supabase not connected. Check .env'); return; }
      if (!form.fullName.trim()) { toast.error('Please enter your full name'); return; }
      if (!form.college.trim()) { toast.error('Please enter your college name'); return; }

      const normalizedEmail = form.collegeEmail.trim().toLowerCase();
      const githubUsername = form.githubUrl.trim() ? extractGithubUsername(form.githubUrl) : null;

      if (!isCollegeEmail(normalizedEmail)) {
        toast.error('Use a valid college email ID (e.g. name@college.edu)');
        return;
      }
      if (form.githubUrl.trim() && !githubUsername) {
        toast.error('Enter a valid GitHub profile URL (e.g. https://github.com/username)');
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: authRedirectUrl,
          data: { github_username: githubUsername || undefined },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`Verification OTP sent to ${normalizedEmail}`);
        setStep(2);
      }
    } else {
      const githubUsername = form.githubUrl.trim() ? extractGithubUsername(form.githubUrl) : null;
      const { data, error } = await supabase.auth.verifyOtp({
        email: form.collegeEmail.trim().toLowerCase(),
        token: otp,
        type: 'signup',
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
            github_username: githubUsername || null,
            updated_at: new Date().toISOString(),
          });
        }
        toast.success('Welcome to the network!');
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Join Verqify.
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Sign up using your official College Email ID.
      </p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleNext}>
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
              type="url"
              placeholder="GitHub URL (optional)"
              value={form.githubUrl}
              onChange={set('githubUrl')}
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
              Send OTP →
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                OTP sent to <b>{form.collegeEmail}</b>
              </span>
            </div>
            <input
              className="input"
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Verify & Join
            </button>
            <button type="button" onClick={() => setStep(1)} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
              ← Go back
            </button>
          </>
        )}
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 500 }}>Log In</Link>
      </p>
    </div>
  );
}
