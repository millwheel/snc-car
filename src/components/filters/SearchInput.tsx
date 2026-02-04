'use client';

export default function SearchInput() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="원하시는 차량을 검색해주세요 (준비 중)"
        disabled
        className="w-full md:w-80 px-4 py-2 pl-10 border border-border rounded-lg bg-bg-secondary text-text-muted cursor-not-allowed"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
