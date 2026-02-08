'use client';

import { useState, useRef, useEffect } from 'react';
import FadeInUp from '@/components/animation/FadeInUp';

const faqs = [
  {
    id: 1,
    question: '장기렌트카 이용시 신용등급 및 대출한도에 영향이 있나요?',
    answer: '장기렌트 진행시 명의는 캐피탈 또는 렌터카 업체이기 때문에 신용등급이나 대출이력에 영향이 가지 않습니다.',
  },
  {
    id: 2,
    question: '장기렌트와 리스는 최대 몇 개월까지 가능한가요?',
    answer: '60개월까지 가능합니다.',
  },
  {
    id: 3,
    question: '리스 진행시 타인 명의로 보험 가입이 가능한가요?',
    answer: '리스 계약자 본인 명의로만 보험가입이 가능하기 때문에 불가능합니다.',
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[number]; isOpen: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-5 text-left rounded-lg transition-colors duration-300 ${
          isOpen
            ? 'bg-primary-dark text-white'
            : 'bg-bg-secondary text-text-primary hover:bg-secondary-light'
        }`}
      >
        <span className="font-medium pr-4">{faq.question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-white/70' : 'text-text-secondary'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height }}
      >
        <div ref={contentRef} className="px-5 py-4">
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <FadeInUp>
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            자주 묻는 질문
          </h2>
        </FadeInUp>

        <FadeInUp delay={150}>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggleFAQ(faq.id)}
              />
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
