/**
 * Data Service Contracts
 *
 * 이 파일은 데이터 서비스 레이어의 인터페이스를 정의합니다.
 * 현재는 mock data를 반환하지만, 추후 API/Supabase 연동 시
 * 동일한 인터페이스를 유지하면서 구현만 교체합니다.
 *
 * Feature: S&C 신차 장기 렌트 리스 공개 웹사이트
 * Branch: 1-snc-landing
 */

import type { Manufacturer, ManufacturerCategory } from '@/types/manufacturer';
import type { SaleCar } from '@/types/saleCar';
import type { ReleasedCar } from '@/types/releasedCar';
import type { QuoteRequest } from '@/types/quote';

// ============================================================================
// Manufacturer Service
// ============================================================================

/**
 * 모든 제조사 조회 (isVisible=true)
 */
export async function getManufacturers(): Promise<Manufacturer[]>;

/**
 * 카테고리별 제조사 조회
 * @param category - 'DOMESTIC' | 'IMPORT'
 */
export async function getManufacturersByCategory(
  category: ManufacturerCategory
): Promise<Manufacturer[]>;

/**
 * 제조사 코드로 단일 조회
 * @param code - 제조사 코드 (예: 'hyundai', 'bmw')
 */
export async function getManufacturerByCode(
  code: string
): Promise<Manufacturer | null>;

// ============================================================================
// SaleCar Service
// ============================================================================

/**
 * 모든 판매 차량 조회 (isVisible=true, 정렬 적용)
 * 정렬: sortOrder ASC, createdAt DESC
 */
export async function getSaleCars(): Promise<SaleCar[]>;

/**
 * 제조사별 판매 차량 조회
 * @param manufacturerCode - 제조사 코드
 */
export async function getSaleCarsByManufacturer(
  manufacturerCode: string
): Promise<SaleCar[]>;

/**
 * 카테고리별 판매 차량 조회 (국산/수입)
 * @param category - 'DOMESTIC' | 'IMPORT'
 */
export async function getSaleCarsByCategory(
  category: ManufacturerCategory
): Promise<SaleCar[]>;

/**
 * 필터 조합으로 판매 차량 조회
 * @param params - 필터 파라미터
 */
export async function getFilteredSaleCars(params: {
  category?: ManufacturerCategory;
  manufacturerCode?: string;
}): Promise<SaleCar[]>;

// ============================================================================
// ReleasedCar Service
// ============================================================================

/**
 * 최근 출고 차량 조회 (isVisible=true, 최대 6개)
 * 정렬: sortOrder ASC, releasedAt DESC, createdAt DESC
 */
export async function getReleasedCars(limit?: number): Promise<ReleasedCar[]>;

// ============================================================================
// Quote Service
// ============================================================================

/**
 * 견적 상담 요청 제출
 * @param request - 견적 요청 데이터
 * @returns 성공 여부
 *
 * MVP: console.log 출력 후 true 반환
 * Future: API POST 후 결과 반환
 */
export async function submitQuoteRequest(
  request: QuoteRequest
): Promise<{ success: boolean; message?: string }>;

// ============================================================================
// Service Implementation Notes
// ============================================================================

/**
 * 구현 위치: src/data/services/
 *
 * 파일 구조:
 * - manufacturer.service.ts
 * - saleCar.service.ts
 * - releasedCar.service.ts
 * - quote.service.ts
 *
 * Mock → API 전환 시:
 * 1. 각 service 파일 내부의 mock import를 API 호출로 교체
 * 2. 인터페이스(함수 시그니처)는 변경 없음
 * 3. 컴포넌트 코드 수정 불필요
 *
 * 예시:
 * ```typescript
 * // 현재 (mock)
 * export async function getSaleCars(): Promise<SaleCar[]> {
 *   return mockSaleCars.filter(car => car.isVisible)
 *     .sort((a, b) => a.sortOrder - b.sortOrder);
 * }
 *
 * // 추후 (API)
 * export async function getSaleCars(): Promise<SaleCar[]> {
 *   const response = await fetch('/api/sale-cars');
 *   return response.json();
 * }
 * ```
 */
