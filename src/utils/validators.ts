/**
 * 전화번호에서 숫자만 추출
 * @param value - 입력된 전화번호 (하이픈 포함 가능)
 * @returns 숫자만 포함된 전화번호
 */
export function normalizePhoneNumber(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

/**
 * 전화번호 유효성 검증
 * @param value - 입력된 전화번호
 * @returns 유효 여부
 */
export function validatePhoneNumber(value: string): boolean {
  const normalized = normalizePhoneNumber(value);
  // 한국 휴대폰 번호: 010, 011, 016, 017, 018, 019로 시작, 10-11자리
  return /^01[0-9]{8,9}$/.test(normalized);
}

/**
 * 필수 입력 필드 검증
 * @param value - 입력값
 * @returns 유효 여부 (비어있지 않음)
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * 이름 유효성 검증
 * @param value - 입력된 이름
 * @returns 유효 여부 (2자 이상)
 */
export function validateName(value: string): boolean {
  return value.trim().length >= 2;
}
