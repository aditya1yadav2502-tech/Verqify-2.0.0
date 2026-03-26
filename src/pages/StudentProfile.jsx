import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SkillFingerprint from '../components/SkillFingerprint';

function SkillProofCard({ skill }) {
  const statusConfig = {
    verified:     { icon: '✦', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  label: 'Verified' },
    demonstrated: { icon: '◈', color: '#eab308', bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.25)',  label: 'Demonstrated' },
    claimed:      { icon: '◇', color: '#6b7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)', label: 'Claimed' },
  };
  const cfg = statusConfig[skill.status] || statusConfig.claimed;
  const barWidth = skill.verification_score ?? skill.verificationScore ?? 0;
  const parts = [];
  if (skill.repo_count || skill.repoCount) parts.push(`${skill.repo_count || skill.repoCount} repo${(skill.repo_count || skill.repoCount) > 1 ? 's' : ''}`);
  if (skill.total_commits || skill.totalCommits) parts.push(`${skill.total_commits || skill.totalCommits} commits`);
  if (skill.deployed_count || skill.deployedCount) parts.push(`${skill.deployed_count || skill.deployedCount} deployed`);
  if (skill.months_active || skill.monthsActive) parts.push(`${skill.months_active || skill.monthsActive} mo active`);
  const metaLine = parts.length > 0 ? parts.join(' · ') : (skill.status === 'claimed' ? 'Mentioned in README · No code evidence found' : 'Limited evidence');

  return (
    <div style={{ padding: '1rem 1.25rem', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>{cfg.icon}</span>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.95rem' }}>{skill.name}</span>
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: cfg.color }}>{cfg.label}</span>
      </div>
      <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, marginBottom: '0.4rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${barWidth}%`, background: cfg.color, borderRadius: 99, transition: 'width 0.8s ease' }} />
      </div>
      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{metaLine}</div>
    </div>
  );
}

function ConfidenceBadge({ level }) {
  const cfg = {
    high:     { bg: '#dcfce7', color: '#166534', label: '🟢 High Confidence' },
    moderate: { bg: '#fef9c3', color: '#854d0e', label: '🟡 Moderate Confidence' },
    low:      { bg: '#fee2e2', color: '#991b1b', label: '🔴 Low Confidence' },
  }[level] || { bg: '#f3f4f6', color: '#6b7280', label: 'Unrated' };
  return (
    <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, background: cfg.bg, color: cfg.color, letterSpacing: '0.03em' }}>{cfg.label}</span>
  );
}

export default function StudentProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) { setLoading(false); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (data) {
        setProfile(data);
        // Fetch skills from the dedicated skills table
        const { data: skillData } = await supabase
          .from('skills')
          .select('*')
          .eq('student_id', data.id)
          .order('status', { ascending: false });
        if (skillData) setSkills(skillData);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [username]);

  if (loading) return <div className="container" style={{ paddingTop: '8rem' }}>Loading verified identity...</div>;
  if (!profile) return <div className="container" style={{ paddingTop: '8rem' }}>Profile not found.</div>;

  const profileSkills = profile.skill_fingerprint || [
    { name: 'Backend', score: 0 },
    { name: 'Database', score: 0 },
    { name: 'Cloud/Ops', score: 0 },
    { name: 'Architecture', score: 0 },
    { name: 'Frontend', score: 0 },
  ];

  // Compute confidence from dimension scores
  const dims = profile.dimension_scores || {};
  const numericDims = Object.values(dims).filter(v => typeof v === 'number');
  const avgDim = numericDims.length > 0 ? Math.round(numericDims.reduce((a,b) => a+b, 0) / numericDims.length) : 0;
  const confidenceLevel = profile.confidence_level || (avgDim >= 60 ? 'high' : avgDim >= 40 ? 'moderate' : 'low');

  return (
    <div className="container animate-fade-in-up" style={{ maxWidth: '900px', paddingTop: '6rem', paddingBottom: '8rem' }}>
      
      {/* Top Section */}
      <header className="mb-8" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
          <div>
            <h1 className="title-hero" style={{ marginBottom: '0.5rem' }}>{profile.full_name}</h1>
            <p className="text-secondary" style={{ fontSize: '1.1rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {profile.engineer_type || profile.college || 'Engineering Student'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <ConfidenceBadge level={confidenceLevel} />
            {profile.is_discoverable && (
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-verified)', border: '1px solid var(--color-verified)', padding: '0.3rem 0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Discoverable
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Layout Grid for Fingerprint & Personality */}
      <section className="animate-fade-in-up delay-100" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr', gap: '4rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-alt)', padding: '2rem', borderRadius: '1rem' }}>
          <SkillFingerprint skills={profileSkills} size={320} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-head)', fontWeight: '600' }}>Engineering Identity</h2>
          
          {profile.ai_personality ? (
            <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-indigo)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>AI Synthesis</div>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                "{profile.ai_personality}"
              </p>
              {profile.strongest_signal && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--accent-indigo)' }}>Strongest Signal:</strong> {profile.strongest_signal}
                </div>
              )}
            </div>
          ) : (
            <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: 1.6 }}>
              {profile.bio || 'Verified engineer with a unique capability shape generated from contributions.'}
            </p>
          )}

          {profile.dimension_scores && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(profile.dimension_scores).filter(([, v]) => typeof v === 'number').map(([key, score]) => (
                <div key={key}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{key}</div>
                  <div className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{score}</div>
                  <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', marginTop: '0.4rem' }}>
                    <div style={{ height: '100%', width: `${score}%`, background: 'var(--accent-indigo)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Verified Skill Map */}
      <section className="animate-fade-in-up delay-200" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontFamily: 'var(--font-head)', fontWeight: '600' }}>Verified Skill Map</h2>
        {skills.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.5rem' }}>
            {skills.map((skill, i) => (
              <SkillProofCard key={i} skill={skill} />
            ))}
          </div>
        ) : profileSkills.filter(s => s.score > 20).length > 0 ? (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {profileSkills.filter(s => s.score > 20).map(skill => (
              <span key={skill.name} className="badge badge-indigo" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>{skill.name}</span>
            ))}
          </div>
        ) : (
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>No high-density skills detected yet. Sync more repositories to build your map.</p>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="animate-fade-in-up delay-500" style={{ padding: '6rem 0', textAlign: 'center', marginTop: '6rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '4rem', backgroundColor: 'var(--color-accent)' }}></div>
        <h3 className="title-section" style={{ marginBottom: '1.5rem' }}>Want a profile like this?</h3>
        <p className="text-lead mb-8">Stop tweaking your bio. Let your code speak.</p>
        <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}>Build your Skill Fingerprint</button>
      </section>

    </div>
  );
}
