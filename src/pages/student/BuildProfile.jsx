import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

export default function BuildProfile() {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState({
    full_name: '',
    college: '',
    branch: 'CSE',
    year_of_study: '1st'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authProfile) {
      Promise.resolve().then(() => {
        setProfile({
          full_name: authProfile.full_name || '',
          college: authProfile.college || '',
          branch: authProfile.branch || 'CSE',
          year_of_study: authProfile.year_of_study || '1st'
        });
      });
    }
  }, [authProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!supabase || !user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: profile.full_name,
        college: profile.college,
        branch: profile.branch,
        year_of_study: profile.year_of_study,
        updated_at: new Date().toISOString()
      });
    setSaving(false);

      if (error) {
      toast.error(error.message);
    } else {
      toast.success('Professional identity updated');
      // Refresh to update AuthContext profile
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  if (!user) return <div className="container" style={{ paddingTop:'8rem' }}>Please log in...</div>;

  return (
    <div style={{ maxWidth: 960 }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="label" style={{ marginBottom: '0.5rem' }}>Verified Identity</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Your Proof.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Control the verified data that feeds your Skill Fingerprint engine.</p>
      </header>

      <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Core Identity</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Full Name</label>
            <input
              type="text"
              className="input"
              style={{ width: '100%' }}
              value={profile.full_name}
              onChange={(e) => setProfile((prev) => ({ ...prev, full_name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>College / University</label>
            <input
              type="text"
              className="input"
              style={{ width: '100%' }}
              value={profile.college}
              onChange={(e) => setProfile((prev) => ({ ...prev, college: e.target.value }))}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Branch
            </label>
            <select
              className="input"
              style={{ width: '100%' }}
              value={profile.branch}
              onChange={(e) => setProfile((prev) => ({ ...prev, branch: e.target.value }))}
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="IT">IT</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Year of study
            </label>
            <select
              className="input"
              style={{ width: '100%' }}
              value={profile.year_of_study}
              onChange={(e) => setProfile((prev) => ({ ...prev, year_of_study: e.target.value }))}
            >
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.85rem 2.5rem' }}>
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
