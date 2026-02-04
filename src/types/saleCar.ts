export enum SaleCarBadge {
  IMMEDIATE = '즉시출고',
  PROMOTION = '프로모션',
}

export interface SaleCar {
  /** 고유 식별자 (UUID) */
  id: string;

  /** 제조사 코드 (Manufacturer.code 참조) */
  manufacturerCode: string;

  /** 제조사명 (표시용, denormalized) */
  manufacturerName: string;

  /** 차량명 (예: 'i7', 'GV80') */
  carName: string;

  /** 썸네일 이미지 URL */
  thumbnailUrl: string;

  /** 렌트 가격 (월 단위, 원). null이면 '비용문의' 표시 */
  rentPrice: number | null;

  /** 리스 가격 (월 단위, 원). null이면 '비용문의' 표시 */
  leasePrice: number | null;

  /** 뱃지 목록 (복수 가능) */
  badges: SaleCarBadge[];

  /** 노출 여부 */
  isVisible: boolean;

  /** 정렬 순서 (오름차순) */
  sortOrder: number;

  /** 생성일시 (ISO 8601) */
  createdAt: string;
}
