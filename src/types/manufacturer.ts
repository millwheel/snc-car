export type ManufacturerCategory = 'DOMESTIC' | 'IMPORT';

export interface Manufacturer {
  /** 고유 식별자 (UUID) */
  id: string;

  /** 제조사 코드 (예: 'hyundai', 'bmw') - 차량과의 관계 키 */
  code: string;

  /** 제조사명 (예: '현대', 'BMW') */
  name: string;

  /** 로고 이미지 URL */
  logoUrl: string;

  /** 국산/수입 구분 */
  category: ManufacturerCategory;

  /** 정렬 순서 (오름차순) */
  sortOrder: number;

  /** 노출 여부 */
  isVisible: boolean;
}
