import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-[#FAF9F6] rounded-[2px] overflow-hidden border border-[#D6D4CC] flex flex-col">
      <div className="px-3 py-2 border-b border-[#D6D4CC] flex justify-between items-center">
        <div className="h-3 w-12 tc-skeleton" />
        <div className="h-3 w-12 tc-skeleton" />
      </div>
      <div className="aspect-[4/3] w-full tc-skeleton border-b border-[#D6D4CC]" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-3 w-16 tc-skeleton" />
        <div className="space-y-1.5">
          <div className="h-4 w-5/6 tc-skeleton" />
          <div className="h-3 w-2/3 tc-skeleton" />
        </div>
        <div className="pt-2.5 border-t border-[#D6D4CC]/80 flex items-center justify-between gap-2">
          <div className="h-5 w-24 tc-skeleton" />
          <div className="w-11 h-11 tc-skeleton" />
        </div>
      </div>
    </div>
  );
}
