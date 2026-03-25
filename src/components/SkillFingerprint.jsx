import React, { useEffect, useState } from 'react';

export default function SkillFingerprint({ skills = [], size = 320 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);
  if (!skills || skills.length === 0) return null;

  const cx = size / 2, cy = size / 2;
  const maxRadius = (size / 2) * 0.72;
  const angleStep = (Math.PI * 2) / skills.length;

  const coord = (i, pct) => {
    const r = mounted ? maxRadius * (pct / 100) : 0;
    const a = i * angleStep - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const points = skills.map((s, i) => coord(i, s.score));
  const poly = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ width: size, height: size, position: 'relative', margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="fingerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {[20,40,60,80,100].map(level => {
          const pts = skills.map((_,i) => {
            const r = maxRadius*(level/100); const a = i*angleStep-Math.PI/2;
            return { x: cx+r*Math.cos(a), y: cy+r*Math.sin(a) };
          });
          return <polygon key={level} points={pts.map(p=>`${p.x},${p.y}`).join(' ')}
            fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1"
            opacity={mounted?1:0} style={{ transition:'opacity 0.8s' }}
            strokeDasharray={level<100?'3,6':'none'} />;
        })}

        {skills.map((_,i) => {
          const end = { x: cx+maxRadius*Math.cos(i*angleStep-Math.PI/2), y: cy+maxRadius*Math.sin(i*angleStep-Math.PI/2) };
          return <line key={i} x1={cx} y1={cy} x2={mounted?end.x:cx} y2={mounted?end.y:cy}
            stroke="rgba(0,0,0,0.04)" strokeWidth="1" style={{ transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }} />;
        })}

        <polygon points={poly} fill="url(#fingerGrad)" style={{ transition:'all 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
        <polygon points={poly} fill="none" stroke="url(#strokeGrad)" strokeWidth="1.5" filter="url(#glow)" style={{ transition:'all 1.2s cubic-bezier(0.16,1,0.3,1)' }} />

        {points.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#6366F1" filter="url(#glow)" style={{ transition:'all 1.2s cubic-bezier(0.16,1,0.3,1)' }} />)}

        {skills.map((skill,i) => {
          const lp = { x: cx+(maxRadius+26)*Math.cos(i*angleStep-Math.PI/2), y: cy+(maxRadius+26)*Math.sin(i*angleStep-Math.PI/2) };
          return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
            fill="var(--text-secondary)" fontSize="0.78rem" fontFamily="var(--font-body)" fontWeight="500"
            opacity={mounted?1:0} style={{ transition:`opacity 0.5s ease ${1+(i*0.1)}s` }}
          >{skill.name}</text>;
        })}
      </svg>
    </div>
  );
}
