import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SkillFingerprint from '../components/SkillFingerprint';
import SkillTag from '../components/SkillTag';
import ProjectCard from '../components/ProjectCard';

export default function StudentProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (data) setProfile(data);
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

  return (
    <div className="container animate-fade-in-up" style={{ maxWidth: '900px', paddingTop: '6rem', paddingBottom: '8rem' }}>
      
      {/* Top Section */}
      <header className="mb-8" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
          <div>
            <h1 className="title-hero" style={{ marginBottom: '0.5rem' }}>{profile.full_name}</h1>
            <p className="text-secondary" style={{ fontSize: '1.1rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {profile.college || 'Engineering Student'}
            </p>
          </div>
          {profile.is_discoverable && (
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--color-verified)', 
              border: '1px solid var(--color-verified)', 
              padding: '0.3rem 0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Discoverable
            </span>
          )}
        </div>
      </header>

      {/* Layout Grid for Fingerprint & Personality */}
      <section className="animate-fade-in-up delay-100" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '4rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-alt)', padding: '2rem' }}>
          <SkillFingerprint skills={profileSkills} size={320} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>Engineering Identity</h2>
          <p className="text-lead" style={{ marginBottom: '2rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            "{profile.bio || 'Your work, verified. Your skills, proven.'}"
          </p>
          <p className="text-secondary" style={{ fontSize: '1.05rem' }}>
            {profile.full_name} has a verified engineering shape generated from their GitHub contributions and project history.
          </p>
        </div>
      </section>

      {/* Verified Skill Map */}
      <section className="animate-fade-in-up delay-200" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: '400', margin: 0 }}>Verified Skill Map</h2>
          <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Live Production Data</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {profileSkills.filter(s => s.score > 20).map(skill => (
            <SkillTag key={skill.name} name={skill.name} status="verified" />
          ))}
        </div>
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
