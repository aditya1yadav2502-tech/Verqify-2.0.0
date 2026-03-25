import React from 'react';
import { BadgeCheck, CircleDot, Circle } from 'lucide-react';

export default function SkillTag({ name, status, count }) {
  let styles = {};
  let Icon = null;

  switch (status) {
    case 'verified':
      styles = {
        bg: 'var(--color-bg)',
        border: '1px solid var(--color-text-primary)',
        text: 'var(--color-text-primary)',
        iconColor: 'var(--color-verified)'
      };
      Icon = BadgeCheck;
      break;
    case 'demonstrated':
      styles = {
        bg: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        text: 'var(--color-text-primary)',
        iconColor: 'var(--color-accent)'
      };
      Icon = CircleDot;
      break;
    case 'claimed':
    default:
      styles = {
        bg: 'transparent',
        border: '1px dashed var(--color-border)',
        text: 'var(--color-text-secondary)',
        iconColor: 'currentColor'
      };
      Icon = Circle;
      break;
  }

  return (
    <div 
      className="btn-outline"
      title={count ? `${count} proof pieces` : 'No proof yet'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.8rem',
        backgroundColor: styles.bg,
        border: styles.border,
        color: styles.text,
        borderRadius: '0', // brutalist edges
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: count ? 'help' : 'default',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
      }}
    >
      <Icon size={14} color={styles.iconColor} strokeWidth={2.5} />
      {name}
    </div>
  );
}
