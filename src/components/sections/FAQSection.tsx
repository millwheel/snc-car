'use client';

import { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: '장기렌트와 리스의 차이점은 무엇인가요?',
    answer: '장기렌트는 차량 명의가 렌트사에 있고 보험/세금이 포함되어 있습니다. 리스는 차량 명의를 고객님으로 할 수 있으며, 운용리스와 금융리스로 나뉩니다. 개인 상황에 따라 유리한 방식이 다르니 상담을 통해 확인해보세요.',
  },
  {
    id: 2,
    question: '초기 비용은 얼마나 드나요?',
    answer: '보증금 또는 선수금 조건에 따라 초기 비용이 달라집니다. 보증금 0%~30%, 선수금 0%~30% 중 선택 가능하며, 초기 비용이 높을수록 월 납입금이 낮아집니다.',
  },
  {
    id: 3,
    question: '계약 기간은 어떻게 되나요?',
    answer: '일반적으로 36개월, 48개월, 60개월 중 선택 가능합니다. 계약 기간이 길수록 월 납입금이 낮아지지만, 총 비용은 증가할 수 있습니다.',
  },
  {
    id: 4,
    question: '중도 해지가 가능한가요?',
    answer: '중도 해지는 가능하지만, 잔여 기간에 따른 위약금이 발생할 수 있습니다. 정확한 조건은 계약 시 안내받으실 수 있습니다.',
  },
  {
    id: 5,
    question: '사고 시 어떻게 처리되나요?',
    answer: '장기렌트의 경우 자차 보험이 포함되어 있어 보험 처리가 가능합니다. 리스의 경우 별도 보험 가입이 필요하며, 사고 시 해당 보험사를 통해 처리됩니다.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-bg-primary">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* 섹션 헤더 */}
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
          자주 묻는 질문
        </h2>

        {/* FAQ 아코디언 */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* 질문 */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between p-4 text-left bg-bg-card hover:bg-bg-secondary transition-colors"
              >
                <span className="font-medium text-text-primary pr-4">
                  {faq.question}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 답변 */}
              {openId === faq.id && (
                <div className="p-4 bg-bg-secondary border-t border-border">
                  <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
