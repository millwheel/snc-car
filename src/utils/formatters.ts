/**
 * 가격을 한국어 형식으로 포맷팅
 * @param price - 가격 (원)
 * @returns 포맷팅된 가격 문자열 (예: "1,234,000원")
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

/**
 * 가격 또는 "비용문의" 반환
 * @param price - 가격 (null이면 비용문의)
 * @param type - 가격 유형 (렌트/리스)
 * @returns 포맷팅된 가격 문자열
 */
export function formatPriceOrInquiry(price: number | null, type: '렌트' | '리스'): string {
  if (price === null) {
    return `${type} 비용문의`;
  }
  return `${type} ${formatPrice(price)}`;
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param dateString - ISO 8601 날짜 문자열
 * @returns 포맷팅된 날짜 (예: "2026.01.15")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 날짜를 한국어 형식으로 포맷팅 (출고일용)
 * @param dateString - ISO 8601 날짜 문자열
 * @returns 포맷팅된 날짜 (예: "2026년 1월 출고")
 */
export function formatReleasedDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월 출고`;
}
