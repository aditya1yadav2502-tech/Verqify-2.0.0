import React, { useEffect, useState } from 'react';

export default function SkillFingerprint({ skills = [], size = 320 }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // trigger drawing animation after mount
    setTimeout(() => setMounted(true), 100);
  }, []);

  if (!skills || skills.length === 0) return null;
  
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = (size / 2) * 0.75; 

  const getCoordinatesForAngle = (angle, percent) => {
    // if not mounted, animate from center
    const r = mounted ? maxRadius * (percent / 100) : 0;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  const angleStep = (Math.PI * 2) / skills.length;
  
  const points = skills.map((skill, i) => {
    return getCoordinatesForAngle(i * angleStep - Math.PI / 2, skill.score);
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ width: size, height: size, position: 'relative', margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {/* Background webs */}
        {[20, 40, 60, 80, 100].map(level => {
          const levelPoints = skills.map((_, i) => {
            const r = maxRadius * (level / 100);
            const a = i * angleStep - Math.PI / 2;
            return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
          });
          return (
            <polygon 
              key={level} 
              points={levelPoints.map(p => `${p.x},${p.y}`).join(' ')} 
              fill="none" 
              stroke="var(--color-border)" 
              strokeWidth="1" 
              opacity={mounted ? 1 : 0}
              style={{ transition: 'opacity 1s ease' }}
              strokeDasharray={level === 100 ? "none" : "1,5"}
            />
          );
        })}
        
        {/* Axes */}
        {skills.map((_, i) => {
          const endPoint = {
            x: cx + maxRadius * Math.cos(i * angleStep - Math.PI / 2),
            y: cy + maxRadius * Math.sin(i * angleStep - Math.PI / 2)
          };
          return (
            <line 
              key={i} 
              x1={cx} y1={cy} 
              x2={mounted ? endPoint.x : cx} y2={mounted ? endPoint.y : cy} 
              stroke="var(--color-border)" 
              strokeWidth="1" 
              style={{ transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          );
        })}

        {/* The Fingerprint shape */}
        <polygon 
          points={polygonPath} 
          fill="rgba(0, 102, 255, 0.08)" 
          stroke="var(--color-accent)" 
          strokeWidth="1.5" 
          style={{ transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        
        {/* Data points */}
        {points.map((p, i) => (
          <circle 
            key={i} 
            cx={p.x} cy={p.y} 
            r="3" 
            fill="var(--color-accent)" 
            style={{ transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        ))}

        {/* Labels */}
        {skills.map((skill, i) => {
          const labelPoint = {
            x: cx + (maxRadius + 25) * Math.cos(i * angleStep - Math.PI / 2),
            y: cy + (maxRadius + 25) * Math.sin(i * angleStep - Math.PI / 2)
          };
          return (
            <text 
              key={i}
              x={labelPoint.x}
              y={labelPoint.y}
              fill="var(--color-text-primary)"
              fontSize="0.85rem"
              fontFamily="var(--font-sans)"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="500"
              opacity={mounted ? 1 : 0}
              style={{ transition: `opacity 0.5s ease ${1 + (i * 0.1)}s` }}
            >
              {skill.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
