import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-4xl p-6 sm:p-7 flex flex-col justify-between items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-neutral-100/60 animate-pulse">
      <div className="space-y-2 w-full flex flex-col items-center">
        <div className="h-5 w-32 bg-neutral-200 rounded-full" />
        <div className="h-3 w-20 bg-neutral-100 rounded-full" />
      </div>

      <div className="my-8 sm:my-10 w-full h-44 sm:h-52 bg-neutral-100 rounded-3xl" />

      <div className="w-full flex items-center justify-between gap-3 pt-2">
        <div className="flex-1 h-9 bg-neutral-100 rounded-full" />
        <div className="w-10 h-10 bg-neutral-200 rounded-full" />
      </div>
    </div>
  );
}
