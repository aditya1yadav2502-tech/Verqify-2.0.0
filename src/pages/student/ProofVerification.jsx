import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { syncGitHubData } from '../../lib/githubApi';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';

// ─── Sub-components ───────────────────────────────────────────────────────────

function VerificationBadge({ level }) {
  const map = {
    exceptional: { bg: '#dcfce7', color: '#166534', label: 'Exceptional' },
    high:        { bg: '#dbeafe', color: '#1e40af', label: 'High' },
    moderate:    { bg: '#fef9c3', color: '#854d0e', label: 'Moderate' },
    low:         { bg: '#fee2e2', color: '#991b1b', label: 'Low' },
    none:        { bg: '#f3f4f6', color: '#6b7280', label: 'Unverified' },
  };
  const s = map[level] || map.none;
  return (
    <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: 999,
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      background: s.bg,
      color: s.color,
    }}>
      {s.label}
    </span>
  );
}

function ScoreBar({ label, score }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600, color }}>{score}/100</span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 99 }}>
        <div style={{ height: 4, width: `${score}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function SkillChip({ skill }) {
  const strengthColor = {
    strong: { bg: '#dcfce7', color: '#166534' },
    moderate: { bg: '#dbeafe', color: '#1e40af' },
    weak: { bg: '#f3f4f6', color: '#6b7280' },
  }[skill.evidence_strength] || { bg: '#f3f4f6', color: '#6b7280' };
  return (
    <div title={skill.proof} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.7rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, background: strengthColor.bg, color: strengthColor.color, cursor: 'help' }}>
      {skill.name}
      <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>({skill.evidence_strength})</span>
    </div>
  );
}

function RepoAuditCard({ audit }) {
  const { analysis, repo: repoName } = audit;
  const verdict = analysis?.overall_verdict;
  const [open, setOpen] = useState(false);

  if (!verdict) return null;

  return (
    <div className="glass" style={{ padding: '1.75rem', borderLeft: `4px solid ${verdict.genuine_work ? 'var(--accent-indigo)' : '#ef4444'}` }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' }}>{repoName}</span>
            {analysis.is_tutorial_or_clone?.verdict && (
              <span style={{ padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, background: '#fef9c3', color: '#854d0e', borderRadius: 4 }}>TUTORIAL CLONE</span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, maxWidth: 560 }}>
            {verdict.summary}
          </p>
        </div>
        <VerificationBadge level={verdict.verification_level} />
      </div>

      {/* Scores row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', margin: '1.5rem 0' }}>
        <div>
          <ScoreBar label="Code Quality" score={analysis.code_quality?.score ?? 0} />
          <ScoreBar label="Understanding Depth" score={analysis.understanding_depth?.score ?? 0} />
        </div>
        <div>
          <ScoreBar label="Commit Quality" score={analysis.commit_quality?.score ?? 0} />
          <ScoreBar label="Real-World Readiness" score={analysis.real_world_readiness?.score ?? 0} />
        </div>
      </div>

      {/* Detected Skills */}
      {Array.isArray(analysis.skills_detected) && analysis.skills_detected.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {analysis.skills_detected.map((s) => (
            <SkillChip key={s.name} skill={s} />
          ))}
        </div>
      )}

      {/* Expand / collapse for flags & signals */}
      <button
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', color: 'var(--accent-indigo)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, marginTop: '0.25rem' }}
      >
        {open ? '▲ Hide details' : '▼ View flags & signals'}
      </button>

      {open && (
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚑ Red Flags</div>
            {verdict.red_flags?.length > 0
              ? verdict.red_flags.map((f, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>• {f}</div>
                ))
              : <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>None detected.</div>}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>★ Standout Signals</div>
            {verdict.standout_signals?.length > 0
              ? verdict.standout_signals.map((s, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>• {s}</div>
                ))
              : <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Nothing exceptional detected.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProofVerification() {
  const { user, profile } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [repoAudits, setRepoAudits] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!user || !supabase) return;
      const { data } = await supabase
        .from('profiles')
        .select('repo_audits, engineer_type, strongest_signal, all_skills')
        .eq('id', user.id)
        .single();
      if (data) {
        setRepoAudits(data.repo_audits);
        setProfileData(data);
      }
    }
    loadData();
  }, [user]);

  const handleForceSync = async () => {
    setSyncing(true);
    const id = toast.loading('Gemini 1.5 Pro is deep-auditing your repositories...');
    try {
      const result = await syncGitHubData();
      if (result) {
        toast.success('Repository audit complete — profile updated!', { id });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error('Sync failed. Ensure GitHub is connected and try again.', { id });
      }
    } catch {
      toast.error('Error during sync. Check console for details.', { id });
    } finally {
      setSyncing(false);
    }
  };

  const hasAudits = Array.isArray(repoAudits) && repoAudits.length > 0;

  return (
    <div style={{ maxWidth: 980 }}>
      {/* Header */}
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="label" style={{ marginBottom: '0.5rem' }}>Trust & Verification</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Proof.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Gemini 1.5 Pro analyses your repositories across 7 dimensions — code quality, understanding depth, commit patterns, originality, and more.
        </p>
      </header>

      {/* Engineering Identity */}
      {profileData?.engineer_type && (
        <section style={{ marginBottom: '3rem' }}>
          <div className="glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div className="label" style={{ color: 'var(--accent-indigo)', marginBottom: '0.4rem' }}>Verified Engineering Identity</div>
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem' }}>
                  {profileData.engineer_type}
                </h2>
                <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--accent-indigo)', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{profileData.strongest_signal}"
                  </p>
                </div>
              </div>

              {profileData.all_skills && (
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Aggregated Skill Proofs</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {profileData.all_skills.slice(0, 12).map((skill, i) => (
                      <div key={i} title={skill.proofs?.join(' | ')} style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.78rem', fontWeight: 600 }}>
                        {skill.name}
                        <span style={{ marginLeft: '0.4rem', color: skill.status === 'verified' ? '#22c55e' : '#eab308', fontSize: '0.65rem' }}>
                          ● {skill.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Connected account */}

      {/* Per-repo audit cards */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>Repository Audit</h2>
          {hasAudits && (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {repoAudits.length} repositories analysed by Gemini 1.5 Pro
            </span>
          )}
        </div>

        {hasAudits ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {repoAudits.map((audit) => (
              <RepoAuditCard key={audit.repo} audit={audit} />
            ))}
          </div>
        ) : (
          <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔬</div>
            <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 600, marginBottom: '0.5rem' }}>
              No audit data yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Click <strong>"Run Deep Audit"</strong> above. Gemini 1.5 Pro will analyse your repositories across 7 dimensions and produce a verified engineering identity.
            </p>
            <button
              onClick={handleForceSync}
              disabled={syncing}
              className="btn btn-primary"
              style={{ padding: '0.8rem 2rem' }}
            >
              {syncing ? 'Analysing...' : 'Run Deep Audit Now →'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
