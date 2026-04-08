import React from 'react';

/* ============ Section Header ============ */
const SectionHeader = ({ title, icon: Icon, subtitle, onShowAll }) => (
  <div className="flex items-end justify-between mb-4 md:mb-5">
    <div>
      <h2 className="text-lg md:text-xl font-bold text-brand-primary flex items-center gap-2 md:gap-2.5">
        {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand-muted" />}
        {title}
      </h2>
      {subtitle && <p className="text-[10px] md:text-xs text-brand-muted mt-0.5 md:mt-1 font-medium">{subtitle}</p>}
    </div>
    {onShowAll && (
      <button onClick={onShowAll} className="text-[10px] md:text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors uppercase tracking-wider">
        Show all
      </button>
    )}
  </div>
);

export default SectionHeader;
