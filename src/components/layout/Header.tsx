'use client';

import Image from 'next/image';
import { useQuoteModal } from '@/hooks/useQuoteModal';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function Header() {
  const { openModal } = useQuoteModal();

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white via-gray-50 to-white border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          {/* 로고 */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2"
          >
            <Image
              src="/images/logo.png"
              alt="S&C 신차장기렌트리스"
              width={140}
              height={50}
            />
          </button>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => scrollToSection('sale-cars')}
              className="px-3 py-2 text-base font-semibold text-text-secondary hover:text-primary transition-colors hidden sm:block"
            >
              판매 차량
            </button>
            <button
              onClick={() => scrollToSection('released-cars')}
              className="px-3 py-2 text-base font-semibold text-text-secondary hover:text-primary transition-colors hidden sm:block"
            >
              출고 내역
            </button>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 text-base font-semibold bg-primary text-white rounded-lg hover:bg-primary transition-all shadow-md"
            >
              빠른 상담
            </button>
            <a
              href="tel:1533-7117"
              className="px-4 py-2 h-10 text-base font-medium border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden md:inline">1533-7117</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
