import React from 'react';
import { BadgeCheck, CircleDot, Circle } from 'lucide-react';

export default function SkillTag({ name, status }) {
  const config = {
    verified:     { cls: 'badge-green',   Icon: BadgeCheck },
    demonstrated: { cls: 'badge-indigo',  Icon: CircleDot  },
    claimed:      { cls: 'badge-neutral', Icon: Circle     },
  }[status] || { cls: 'badge-neutral', Icon: Circle };

  return (
    <span className={`badge ${config.cls}`}>
      <config.Icon size={11} strokeWidth={2.5} />
      {name}
    </span>
  );
}
