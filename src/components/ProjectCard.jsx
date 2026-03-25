import React from 'react';
import { ExternalLink } from 'lucide-react';

const GithubIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectCard({ title, description, tags, isLive, link, githubUrl }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>
          {title}
          {isLive && (
            <span style={{
              marginLeft: '0.75rem',
              fontSize: '0.65rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-verified)',
              border: '1px solid var(--color-verified)',
              padding: '0.15rem 0.4rem',
              borderRadius: '0',
              verticalAlign: 'middle'
            }}>Live</span>
          )}
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', opacity: 0.5, transition: 'opacity 0.2s' }} className="card-icons">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-primary)' }}>
              <GithubIcon size={18} />
            </a>
          )}
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-primary)' }}>
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
      
      <p className="text-secondary" style={{ fontSize: '0.95rem', marginBottom: '2rem', flex: 1 }}>
        {description}
      </p>
      
      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
