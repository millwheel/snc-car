import type { QuoteRequest } from '@/types/quote';

/**
 * 견적 상담 요청 제출
 * MVP: console.log 출력 후 성공 반환
 * Future: API POST 후 결과 반환
 */
export async function submitQuoteRequest(
  request: QuoteRequest
): Promise<{ success: boolean; message?: string }> {
  // 시뮬레이션: 약간의 지연
  await new Promise((resolve) => setTimeout(resolve, 500));

  // MVP: console.log로 출력
  console.log('Quote submission:', {
    ...request,
    submittedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: '견적 상담 신청이 완료되었습니다.',
  };
}
