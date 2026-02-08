'use client';

import { useRef } from 'react';
import type { Manufacturer } from '@/types/manufacturer';

interface ManufacturerFilterProps {
  manufacturers: Manufacturer[];
  selectedCode: string | null;
  onSelect: (code: string | null) => void;
}

export default function ManufacturerFilter({
  manufacturers,
  selectedCode,
  onSelect,
}: ManufacturerFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleSelect = (code: string) => {
    if (selectedCode === code) {
      onSelect(null); // 선택 해제
    } else {
      onSelect(code);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* 왼쪽 화살표 */}
      <button
        onClick={() => scroll('left')}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border border-border rounded-full hover:bg-bg-secondary transition-colors"
        aria-label="이전"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 제조사 로고 카로셀 */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {manufacturers.map((manufacturer) => (
          <button
            key={manufacturer.id}
            onClick={() => handleSelect(manufacturer.id)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-24 h-20 rounded-lg border-2 transition-all ${
              selectedCode === manufacturer.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-white hover:border-secondary'
            }`}
          >
            <div className="w-12 h-10 flex items-center justify-center mb-1">
                {/* TODO 여기에 로고 이미지 렌더링 */}
            </div>
            <span className="text-xs text-text-secondary">{manufacturer.name}</span>
          </button>
        ))}
      </div>

      {/* 오른쪽 화살표 */}
      <button
        onClick={() => scroll('right')}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border border-border rounded-full hover:bg-bg-secondary transition-colors"
        aria-label="다음"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
