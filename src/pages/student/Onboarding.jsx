import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    college: '',
    branch: 'CSE',
    year_of_study: '1st',
    bio: '',
    github_username: user?.user_metadata?.user_name || '',
  });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !supabase) return;
    if (!form.full_name.trim()) { toast.error('Full name is required'); return; }
    if (!form.college.trim()) { toast.error('College is required'); return; }

    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: form.full_name.trim(),
      college: form.college.trim(),
      branch: form.branch,
      year_of_study: form.year_of_study,
      bio: form.bio.trim() || null,
      github_username: form.github_username.trim() || null,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile created — welcome to Verqify!');
      // Force a full reload so AuthContext re-fetches the profile
      window.location.href = '/dashboard';
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', background: 'var(--bg-base)' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-head)', margin: '0 auto 1.25rem' }}>V</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Complete Your Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Tell us about yourself so recruiters can discover you.</p>
        </div>

        <div className="glass" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name *</label>
              <input className="input" type="text" placeholder="e.g. Aditya Yadav" value={form.full_name} onChange={set('full_name')} required style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>College / University *</label>
              <input className="input" type="text" placeholder="e.g. IIT Bombay" value={form.college} onChange={set('college')} required style={{ width: '100%' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Branch</label>
                <select className="input" value={form.branch} onChange={set('branch')} style={{ width: '100%' }}>
                  <option value="CSE">CSE — Computer Science</option>
                  <option value="ECE">ECE — Electronics</option>
                  <option value="IT">IT — Information Tech</option>
                  <option value="ME">ME — Mechanical</option>
                  <option value="CE">CE — Civil</option>
                  <option value="EE">EE — Electrical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Year of Study</label>
                <select className="input" value={form.year_of_study} onChange={set('year_of_study')} style={{ width: '100%' }}>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>GitHub Username</label>
              <input className="input" type="text" placeholder="e.g. aditya1yadav2502" value={form.github_username} onChange={set('github_username')} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Short Bio</label>
              <textarea className="input" placeholder="What are you building? (optional)" value={form.bio} onChange={set('bio')} rows={3} style={{ width: '100%', resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
              {saving ? 'Saving...' : 'Launch My Profile →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
