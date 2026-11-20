import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-[#E2E7EE] flex flex-col">
      <div className="aspect-[4/3] w-full tc-skeleton" />
      <div className="p-3.5 sm:p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 rounded-full tc-skeleton" />
          <div className="h-3 w-12 rounded-full tc-skeleton" />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-5/6 rounded-full tc-skeleton" />
          <div className="h-3 w-2/3 rounded-full tc-skeleton" />
        </div>
        <div className="pt-2.5 border-t border-[#ECEFF4] flex items-center justify-between gap-2">
          <div className="h-5 w-24 rounded-full tc-skeleton" />
          <div className="w-10 h-10 rounded-full tc-skeleton" />
        </div>
      </div>
    </div>
  );
}
