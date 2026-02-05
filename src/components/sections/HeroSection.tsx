'use client';

import { useQuoteModal } from '@/hooks/useQuoteModal';

export default function HeroSection() {
  const { openModal } = useQuoteModal();

  return (
    <section className="relative bg-gradient-to-br from-[#2d3748] via-[#4a5568] to-[#1a202c] text-white py-20 md:py-32 overflow-hidden">
      {/* 메탈릭 광택 효과 */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="max-w-2xl">
          {/* 타이틀 */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            신차 장기 렌트 & 리스<br />
            S&C와 함께하세요
          </h1>

          {/* 설명 */}
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            합리적인 가격, 믿을 수 있는 서비스<br />
            국산차부터 수입차까지 다양한 차량을 만나보세요
          </p>

          {/* CTA 버튼 */}
          <button
            onClick={() => openModal()}
            className="px-8 py-4 bg-gradient-to-r from-white via-gray-100 to-white text-primary-dark font-bold rounded-lg hover:from-gray-100 hover:via-white hover:to-gray-100 transition-all text-lg shadow-lg border border-white/50"
          >
            무료 견적 받기
          </button>

          {/* 서브 정보 */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>전 차종 취급</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>최저가 보장</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>빠른 출고</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
