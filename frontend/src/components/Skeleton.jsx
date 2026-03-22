import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClasses = "animate-pulse bg-brand-surface border border-white/[0.02] rounded-md";
  const variants = {
    rect: "h-full w-full",
    circle: "rounded-full h-12 w-12",
    text: "h-4 w-3/4 mb-2 rounded",
    subtext: "h-3 w-1/2 rounded"
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export const SongSkeleton = () => (
  <div className="flex items-center gap-4 bg-brand-surface rounded-lg p-3 border border-white/[0.02]">
    <Skeleton className="w-14 h-14 shrink-0 rounded-md" />
    <div className="flex-1">
      <Skeleton variant="text" />
      <Skeleton variant="subtext" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="aspect-square bg-brand-surface rounded-2xl p-4 flex flex-col justify-end gap-3 border border-white/[0.02]">
    <Skeleton className="w-1/2 h-6" />
    <Skeleton className="w-1/3 h-4" />
  </div>
);

export default Skeleton;
