# Implementation Plan: S&C 신차 장기 렌트 리스 공개 웹사이트

**Branch**: `1-snc-landing` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-snc-landing/spec.md`

## Summary

S&C 신차 장기 렌트 리스 서비스의 공개 랜딩 페이지를 구축한다. 고객이 판매 차량을 탐색(국산/수입 필터, 제조사 필터)하고, 견적 상담을 신청할 수 있는 단일 페이지 웹사이트를 Next.js 14 App Router + TailwindCSS로 구현한다. 초기 구현은 mock data를 사용하며, 추후 API/DB 연동이 가능한 구조로 설계한다.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18.x, Next.js 14.x (App Router), TailwindCSS
**Storage**: Mock data (추후 Supabase 연동 대비 구조)
**Testing**: Jest
**Target Platform**: Web (반응형: 모바일 320px+, 태블릿 768px+, 데스크톱 1024px+)
**Project Type**: Web application (Frontend only for MVP)
**Performance Goals**: 페이지 로드 3초 이내, 필터링 0.5초 이내
**Constraints**: Client-side filtering, mock data 기반
**Scale/Scope**: 단일 랜딩 페이지, 7개 섹션, 1개 모달

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution이 템플릿 상태이므로 특정 게이트가 적용되지 않음. 일반적인 개발 원칙 준수:

| Gate | Status | Notes |
|------|--------|-------|
| 컴포넌트 분리 | ✅ PASS | 재사용 가능한 컴포넌트로 분리 |
| 타입 안전성 | ✅ PASS | TypeScript 엄격 모드 사용 |
| 데이터 소스 분리 | ✅ PASS | mock → API 교체 가능한 data service layer |
| 반응형 디자인 | ✅ PASS | TailwindCSS 브레이크포인트 활용 |

## Project Structure

### Documentation (this feature)

```text
specs/1-snc-landing/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (data service interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page (메인)
│   └── globals.css         # Global styles with color variables
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Sticky header with navigation
│   │   └── Footer.tsx      # Footer with business info
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── SaleCarSection.tsx
│   │   ├── StrengthSection.tsx
│   │   ├── ReleasedCarSection.tsx
│   │   └── FAQSection.tsx
│   ├── cards/
│   │   ├── SaleCarCard.tsx
│   │   ├── ReleasedCarCard.tsx
│   │   └── StrengthCard.tsx
│   ├── filters/
│   │   ├── CategoryTabs.tsx
│   │   ├── ManufacturerFilter.tsx
│   │   └── SearchInput.tsx (disabled placeholder)
│   └── modals/
│       └── QuoteModal.tsx
├── data/
│   ├── services/
│   │   ├── manufacturer.service.ts
│   │   ├── saleCar.service.ts
│   │   └── releasedCar.service.ts
│   └── mocks/
│       ├── manufacturers.ts
│       ├── saleCars.ts
│       └── releasedCars.ts
├── types/
│   ├── manufacturer.ts
│   ├── saleCar.ts
│   ├── releasedCar.ts
│   └── quote.ts
├── utils/
│   ├── formatters.ts       # Price formatting, date formatting
│   └── validators.ts       # Phone number validation
└── hooks/
    ├── useQuoteModal.ts
    └── useCarFilter.ts

tests/
├── unit/
│   ├── components/
│   ├── utils/
│   └── hooks/
└── integration/
    └── pages/

public/
└── images/
    ├── logo.png
    ├── hero-bg.jpg
    └── placeholders/
```

**Structure Decision**: Next.js App Router 기반 단일 웹 애플리케이션. Backend가 없으므로 frontend-only 구조 채택. Data service layer를 통해 mock data와 향후 API 교체를 추상화.

## Complexity Tracking

해당 없음 - Constitution 위반 사항 없음.
