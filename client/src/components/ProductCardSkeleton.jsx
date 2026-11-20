import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-tc-card flex flex-col">
      <div className="aspect-[4/3] w-full tc-skeleton" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-16 rounded-md tc-skeleton" />
          <div className="h-4 w-10 rounded-md tc-skeleton" />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-5/6 rounded-md tc-skeleton" />
          <div className="h-3 w-2/3 rounded-md tc-skeleton" />
        </div>
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div className="h-5 w-24 rounded-md tc-skeleton" />
          <div className="w-11 h-11 rounded-xl tc-skeleton" />
        </div>
      </div>
    </div>
  );
}
