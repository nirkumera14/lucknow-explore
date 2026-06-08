import React from 'react';

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/5">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="flex justify-between mt-2">
          <div className="skeleton h-3 w-1/3 rounded" />
          <div className="skeleton h-3 w-1/4 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto py-12">
      <div className="skeleton h-12 w-1/3 rounded-xl mb-4" />
      <div className="skeleton h-4 w-1/2 rounded mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
