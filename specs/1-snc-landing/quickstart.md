# Quickstart: S&C 신차 장기 렌트 리스 공개 웹사이트

**Feature Branch**: `1-snc-landing`
**Date**: 2026-02-04

## Prerequisites

- Node.js 18.x 이상
- npm 또는 yarn

## Setup

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 확인
# http://localhost:3000
```

## Project Structure Summary

```text
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # 색상 변수 정의 (반드시 수정 필요)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # 메인 랜딩 페이지
├── components/             # React 컴포넌트
│   ├── layout/             # Header, Footer
│   ├── sections/           # 페이지 섹션 컴포넌트
│   ├── cards/              # 카드 컴포넌트
│   ├── filters/            # 필터 UI 컴포넌트
│   └── modals/             # 모달 컴포넌트
├── data/
│   ├── services/           # 데이터 서비스 레이어
│   └── mocks/              # Mock 데이터
├── types/                  # TypeScript 타입 정의
├── utils/                  # 유틸리티 함수
└── hooks/                  # Custom hooks
```

## Key Implementation Points

### 1. 색상 시스템 (globals.css)

`src/app/globals.css`에 다음 색상 변수를 추가해야 합니다:

```css
@theme inline {
  /* Primary - 청남색 (Navy Blue) */
  --color-primary: #1e3a5f;
  --color-primary-light: #2d4a6f;
  --color-primary-dark: #0f2a4f;

  /* Secondary - 메탈릭 그레이 (Slate) */
  --color-secondary: #64748b;
  --color-secondary-light: #94a3b8;
  --color-secondary-dark: #475569;

  /* Backgrounds, Borders, Text, Badges... */
}
```

### 2. 타입 정의

`src/types/` 폴더에 다음 파일 생성:

- `manufacturer.ts` - Manufacturer, ManufacturerCategory
- `saleCar.ts` - SaleCar, SaleCarBadge enum
- `releasedCar.ts` - ReleasedCar
- `quote.ts` - QuoteRequest 및 관련 타입

### 3. Mock 데이터

`src/data/mocks/` 폴더에 다음 파일 생성:

- `manufacturers.ts` - 제조사 목록 (국산 5-6개, 수입 5-9개)
- `saleCars.ts` - 판매 차량 목록 (20-50개)
- `releasedCars.ts` - 출고 차량 목록 (10-20개)

### 4. 데이터 서비스

`src/data/services/` 폴더에 다음 파일 생성:

```typescript
// manufacturer.service.ts
export async function getManufacturers(): Promise<Manufacturer[]>
export async function getManufacturersByCategory(category): Promise<Manufacturer[]>

// saleCar.service.ts
export async function getSaleCars(): Promise<SaleCar[]>
export async function getFilteredSaleCars(params): Promise<SaleCar[]>

// releasedCar.service.ts
export async function getReleasedCars(limit?): Promise<ReleasedCar[]>

// quote.service.ts
export async function submitQuoteRequest(request): Promise<{ success: boolean }>
```

### 5. 컴포넌트 구현 순서 (권장)

1. **Types & Mocks**: 타입 정의 → Mock 데이터 생성
2. **Layout**: Header → Footer
3. **Sections**: HeroSection → SaleCarSection → StrengthSection → ReleasedCarSection → FAQSection
4. **Cards**: SaleCarCard → ReleasedCarCard → StrengthCard
5. **Filters**: CategoryTabs → ManufacturerFilter → SearchInput
6. **Modal**: QuoteModal (폼 포함)
7. **Integration**: page.tsx에서 모든 컴포넌트 조합

## Testing

```bash
# 유닛 테스트 실행
npm run test

# 특정 파일만 테스트
npm run test -- --testPathPattern=SaleCarCard
```

## Key Commands

```bash
npm run dev       # 개발 서버 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버
npm run lint      # ESLint 검사
npm run test      # Jest 테스트
```

## Responsive Breakpoints

| Breakpoint | Width | Grid Columns (SaleCar) |
|------------|-------|----------------------|
| Mobile | < 768px | 1 |
| Tablet | 768px - 1023px | 2 |
| Desktop | >= 1024px | 4 |

TailwindCSS:
- `md:` = 768px+
- `lg:` = 1024px+

## Mock → API 전환 체크리스트

추후 실제 API/Supabase 연동 시:

- [ ] `src/data/services/*.service.ts` 내부 구현 변경
- [ ] API 엔드포인트 생성 (`/app/api/...`)
- [ ] 환경 변수 설정 (Supabase URL, Key 등)
- [ ] 에러 핸들링 추가
- [ ] 로딩 상태 UI 추가

## Troubleshooting

### 색상이 적용되지 않음
- `globals.css`의 `@theme inline` 블록 확인
- TailwindCSS 클래스명에서 `bg-primary`, `text-primary` 등 사용

### 필터가 동작하지 않음
- `useCarFilter` hook의 dependency 배열 확인
- `Manufacturer.code`와 `SaleCar.manufacturerCode` 매칭 확인

### 모달이 열리지 않음
- `QuoteModalProvider`가 layout.tsx에 추가되었는지 확인
- `useQuoteModal()` hook 사용 위치 확인
