# Data Model: S&C 신차 장기 렌트 리스 공개 웹사이트

**Feature Branch**: `1-snc-landing`
**Date**: 2026-02-04

## Overview

이 문서는 S&C 랜딩 페이지의 데이터 모델을 정의합니다. 현재는 mock data 기반이며, 추후 Supabase/API 연동을 대비한 구조입니다.

---

## Entities

### 1. Manufacturer (제조사)

차량 제조사 정보. 국산/수입 필터링의 기준이 됨.

```typescript
// src/types/manufacturer.ts

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
```

**Validation Rules**:
- `code`: unique, lowercase alphanumeric
- `sortOrder`: >= 0
- `logoUrl`: valid URL format

**Relationships**:
- `Manufacturer.code` ← `SaleCar.manufacturerCode` (1:N)

---

### 2. SaleCarBadge (뱃지 열거형)

판매 차량 카드에 표시되는 스티커 타입.

```typescript
// src/types/saleCar.ts

export enum SaleCarBadge {
  IMMEDIATE = '즉시출고',
  PROMOTION = '프로모션',
}
```

**Constraints**:
- 새로운 뱃지 추가 시 enum 확장 필요
- UI 색상은 뱃지 타입별로 고정 (IMMEDIATE: red, PROMOTION: green)

---

### 3. SaleCar (판매 차량)

판매 중인 차량 정보. 메인 필터링 대상.

```typescript
// src/types/saleCar.ts

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
```

**Validation Rules**:
- `manufacturerCode`: must exist in Manufacturer
- `rentPrice`, `leasePrice`: >= 0 if not null
- `badges`: only SaleCarBadge enum values
- `sortOrder`: >= 0
- `createdAt`: ISO 8601 format

**Sorting Rules**:
1. `sortOrder` ASC
2. `createdAt` DESC

**Filtering**:
- `isVisible === true` only
- Category filter via `Manufacturer.category`
- Manufacturer filter via `manufacturerCode`

---

### 4. ReleasedCar (출고 차량)

출고 완료된 차량 정보. 사회적 증거(social proof) 섹션용.

```typescript
// src/types/releasedCar.ts

export interface ReleasedCar {
  /** 고유 식별자 (UUID) */
  id: string;

  /** 차량명 */
  carName: string;

  /** 썸네일 이미지 URL */
  thumbnailUrl: string;

  /** 출고일 (ISO 8601 date) */
  releasedAt: string;

  /** 노출 여부 */
  isVisible: boolean;

  /** 정렬 순서 (오름차순) */
  sortOrder: number;

  /** 생성일시 (ISO 8601) */
  createdAt: string;
}
```

**Validation Rules**:
- `releasedAt`: ISO 8601 date format (YYYY-MM-DD)
- `sortOrder`: >= 0

**Sorting Rules**:
1. `sortOrder` ASC
2. `releasedAt` DESC
3. `createdAt` DESC

**Display Rules**:
- Maximum 6 items displayed
- `isVisible === true` only

---

### 5. QuoteRequest (견적 상담 요청)

고객이 제출하는 견적 상담 폼 데이터.

```typescript
// src/types/quote.ts

export type CustomerType = '개인' | '개인사업자' | '법인';
export type InitialFundType = '보증금' | '선수금';
export type InitialFundRate = 0 | 10 | 20 | 30;
export type ContractPeriod = 36 | 48 | 60;

export interface QuoteRequest {
  /** 고객 이름 */
  name: string;

  /** 전화번호 (숫자만, 정규화 후 저장) */
  phone: string;

  /** 지역 */
  region: string;

  /** 고객 유형 */
  customerType: CustomerType;

  /** 초기자금 유형 */
  initialFundType: InitialFundType;

  /** 초기자금 비율 (%) */
  initialFundRate: InitialFundRate;

  /** 계약 기간 (개월) */
  contractPeriod: ContractPeriod;

  /** 선택 차량명 (차량 카드에서 열었을 때) */
  selectedCarName?: string;

  /** 선택 제조사명 (차량 카드에서 열었을 때) */
  selectedManufacturerName?: string;

  /** 개인정보 동의 여부 */
  privacyAgreed: boolean;

  /** 제출 시각 (ISO 8601) */
  submittedAt?: string;
}
```

**Validation Rules**:
- `name`: required, non-empty
- `phone`: required, 10-11 digits after normalization, starts with '01'
- `region`: required, non-empty
- `customerType`: must be one of enum values
- `initialFundType`: must be one of enum values
- `initialFundRate`: must be 0, 10, 20, or 30
- `contractPeriod`: must be 36, 48, or 60
- `privacyAgreed`: must be true

---

## Entity Relationship Diagram

```text
┌─────────────────┐
│  Manufacturer   │
├─────────────────┤
│ id              │
│ code (unique)   │◄─────────────┐
│ name            │              │
│ logoUrl         │              │
│ category        │              │ manufacturerCode
│ sortOrder       │              │
│ isVisible       │              │
└─────────────────┘              │
                                 │
┌─────────────────┐              │
│    SaleCar      │              │
├─────────────────┤              │
│ id              │              │
│ manufacturerCode│──────────────┘
│ manufacturerName│ (denormalized)
│ carName         │
│ thumbnailUrl    │
│ rentPrice       │
│ leasePrice      │
│ badges[]        │──────► SaleCarBadge (enum)
│ isVisible       │
│ sortOrder       │
│ createdAt       │
└─────────────────┘

┌─────────────────┐
│  ReleasedCar    │
├─────────────────┤
│ id              │
│ carName         │
│ thumbnailUrl    │
│ releasedAt      │
│ isVisible       │
│ sortOrder       │
│ createdAt       │
└─────────────────┘

┌─────────────────┐
│  QuoteRequest   │
├─────────────────┤
│ name            │
│ phone           │
│ region          │
│ customerType    │
│ initialFundType │
│ initialFundRate │
│ contractPeriod  │
│ selectedCarName?│
│ selectedMfr?    │
│ privacyAgreed   │
│ submittedAt     │
└─────────────────┘
```

---

## State Transitions

### QuoteRequest Lifecycle (Future)

현재 MVP에서는 console.log로 출력만 하지만, 추후 API 연동 시 다음 상태를 가질 수 있음:

```text
[DRAFT] → [SUBMITTED] → [CONTACTED] → [CONVERTED | CLOSED]
```

---

## Data Volume Assumptions

| Entity | Expected Count (MVP) | Notes |
|--------|---------------------|-------|
| Manufacturer | 10-15 | 국산 5-6, 수입 5-9 |
| SaleCar | 20-50 | 초기 mock data |
| ReleasedCar | 10-20 | 최대 6개 표시 |
| QuoteRequest | N/A | console.log only |

---

## Mock Data Files

```text
src/data/mocks/
├── manufacturers.ts   # Manufacturer[]
├── saleCars.ts        # SaleCar[]
└── releasedCars.ts    # ReleasedCar[]
```

각 mock 파일은 해당 타입의 배열을 export:

```typescript
// src/data/mocks/manufacturers.ts
import type { Manufacturer } from '@/types/manufacturer';

export const mockManufacturers: Manufacturer[] = [
  {
    id: '1',
    code: 'hyundai',
    name: '현대',
    logoUrl: '/images/manufacturers/hyundai.png',
    category: 'DOMESTIC',
    sortOrder: 1,
    isVisible: true,
  },
  // ...
];
```
