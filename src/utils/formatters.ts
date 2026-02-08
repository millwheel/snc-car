/**
 * 날짜를 한국어 형식으로 포맷팅 (출고일용)
 * @param dateString - ISO 8601 날짜 문자열
 * @returns 포맷팅된 날짜 (예: "2026년 1월 출고")
 */
export function formatReleasedDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 출고`;
}
