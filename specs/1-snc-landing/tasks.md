# Tasks: S&C 신차 장기 렌트 리스 공개 웹사이트

**Input**: Design documents from `/specs/1-snc-landing/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, types, and mock data foundation

- [x] T001 Update globals.css with project color variables in src/app/globals.css
- [x] T002 [P] Create Manufacturer type definition in src/types/manufacturer.ts
- [x] T003 [P] Create SaleCar type and SaleCarBadge enum in src/types/saleCar.ts
- [x] T004 [P] Create ReleasedCar type definition in src/types/releasedCar.ts
- [x] T005 [P] Create QuoteRequest type and related types in src/types/quote.ts
- [x] T006 [P] Create price formatter utility in src/utils/formatters.ts
- [x] T007 [P] Create phone number validator utility in src/utils/validators.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Mock data and data services that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 [P] Create manufacturer mock data in src/data/mocks/manufacturers.ts
- [x] T009 [P] Create saleCar mock data in src/data/mocks/saleCars.ts
- [x] T010 [P] Create releasedCar mock data in src/data/mocks/releasedCars.ts
- [x] T011 [P] Implement manufacturer.service.ts in src/data/services/manufacturer.service.ts
- [x] T012 [P] Implement saleCar.service.ts in src/data/services/saleCar.service.ts
- [x] T013 [P] Implement releasedCar.service.ts in src/data/services/releasedCar.service.ts
- [x] T014 Create QuoteModalProvider context and useQuoteModal hook in src/hooks/useQuoteModal.tsx
- [x] T015 Create useCarFilter custom hook in src/hooks/useCarFilter.ts
- [x] T016 Update root layout with QuoteModalProvider in src/app/layout.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 판매 차량 탐색 (Priority: P1) 🎯 MVP

**Goal**: 고객이 국산/수입 필터와 제조사 필터를 활용해 판매 차량을 탐색하고 가격 정보를 확인

**Independent Test**: 페이지 접속 → 판매 차량 섹션 → 필터 조작 → 차량 카드 확인

### Implementation for User Story 1

- [x] T017 [P] [US1] Create CategoryTabs component (전체/국산/수입) in src/components/filters/CategoryTabs.tsx
- [x] T018 [P] [US1] Create ManufacturerFilter component (로고 카로셀) in src/components/filters/ManufacturerFilter.tsx
- [x] T019 [P] [US1] Create SearchInput component (비활성 placeholder) in src/components/filters/SearchInput.tsx
- [x] T020 [P] [US1] Create SaleCarCard component in src/components/cards/SaleCarCard.tsx
- [x] T021 [US1] Create SaleCarSection component in src/components/sections/SaleCarSection.tsx
- [x] T022 [US1] Integrate SaleCarSection into main page in src/app/page.tsx

**Checkpoint**: User Story 1 완료 - 판매 차량 탐색 기능 동작 확인 가능

---

## Phase 4: User Story 2 - 견적 상담 신청 (Priority: P1) 🎯 MVP

**Goal**: 고객이 견적 상담 모달에서 필수 정보를 입력하고 제출

**Independent Test**: 모달 열기 → 폼 입력 → 유효성 검증 → 제출 → 완료 메시지

### Implementation for User Story 2

- [x] T023 [P] [US2] Implement quote.service.ts in src/data/services/quote.service.ts
- [x] T024 [US2] Create QuoteModal component with form in src/components/modals/QuoteModal.tsx
- [x] T025 [US2] Add QuoteModal rendering to layout or page in src/app/layout.tsx
- [x] T026 [US2] Connect SaleCarCard CTA to open modal with car info in src/components/cards/SaleCarCard.tsx

**Checkpoint**: User Story 2 완료 - 견적 상담 신청 기능 동작 확인 가능

---

## Phase 5: User Story 3 - 랜딩 페이지 첫 인상 (Priority: P2)

**Goal**: 히어로 배너를 통해 서비스를 한눈에 파악하고 신뢰감 형성

**Independent Test**: 페이지 접속 → 히어로 배너 표시 → CTA 버튼 클릭 → 모달 오픈

### Implementation for User Story 3

- [x] T027 [US3] Create HeroSection component in src/components/sections/HeroSection.tsx
- [x] T028 [US3] Integrate HeroSection into main page (최상단) in src/app/page.tsx

**Checkpoint**: User Story 3 완료 - 히어로 섹션 표시 및 CTA 동작 확인 가능

---

## Phase 6: User Story 4 - 출고 내역 확인 (Priority: P2)

**Goal**: 최근 출고된 차량 내역으로 S&C 실적과 신뢰도 확인

**Independent Test**: 출고 내역 섹션 스크롤 → 2x3 그리드 → 차량 정보 확인

### Implementation for User Story 4

- [x] T029 [P] [US4] Create ReleasedCarCard component in src/components/cards/ReleasedCarCard.tsx
- [x] T030 [US4] Create ReleasedCarSection component in src/components/sections/ReleasedCarSection.tsx
- [x] T031 [US4] Integrate ReleasedCarSection into main page in src/app/page.tsx

**Checkpoint**: User Story 4 완료 - 출고 내역 섹션 동작 확인 가능

---

## Phase 7: User Story 5 - 핵심 강점 확인 (Priority: P3)

**Goal**: S&C의 핵심 강점과 차별점 전달

**Independent Test**: 핵심 강점 섹션 스크롤 → 강점 카드들 확인

### Implementation for User Story 5

- [x] T032 [P] [US5] Create StrengthCard component in src/components/cards/StrengthCard.tsx
- [x] T033 [US5] Create StrengthSection component in src/components/sections/StrengthSection.tsx
- [x] T034 [US5] Integrate StrengthSection into main page in src/app/page.tsx

**Checkpoint**: User Story 5 완료 - 핵심 강점 섹션 동작 확인 가능

---

## Phase 8: User Story 6 - FAQ 확인 (Priority: P3)

**Goal**: 자주 묻는 질문으로 고객 궁금증 해소

**Independent Test**: FAQ 섹션 스크롤 → 질문 클릭 → 답변 펼침 → 다른 질문 클릭 → 기존 닫힘

### Implementation for User Story 6

- [x] T035 [US6] Create FAQSection component with accordion in src/components/sections/FAQSection.tsx
- [x] T036 [US6] Integrate FAQSection into main page in src/app/page.tsx

**Checkpoint**: User Story 6 완료 - FAQ 아코디언 동작 확인 가능

---

## Phase 9: User Story 7 - 네비게이션 (Priority: P2)

**Goal**: 헤더 네비게이션으로 원하는 섹션 이동 및 전화 상담

**Independent Test**: 로고 클릭 → 최상단 / 판매 차량 클릭 → 해당 섹션 / 전화번호 클릭 → tel: 실행

### Implementation for User Story 7

- [x] T037 [US7] Create Header component with sticky navigation in src/components/layout/Header.tsx
- [x] T038 [US7] Create Footer component with business info in src/components/layout/Footer.tsx
- [x] T039 [US7] Integrate Header and Footer into layout in src/app/layout.tsx
- [x] T040 [US7] Add section IDs for scroll navigation in src/app/page.tsx

**Checkpoint**: User Story 7 완료 - 헤더/푸터 및 스크롤 네비게이션 동작 확인 가능

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, 반응형 검증, 최종 정리

- [x] T041 [P] Add empty state handling to SaleCarSection (차량 없음 메시지) in src/components/sections/SaleCarSection.tsx
- [x] T042 [P] Add empty state handling to ReleasedCarSection (출고 내역 없음) in src/components/sections/ReleasedCarSection.tsx
- [x] T043 [P] Add placeholder image for image load failures in public/images/placeholders/
- [x] T044 Verify responsive layout on mobile (320px), tablet (768px), desktop (1024px+)
- [x] T045 Final integration test: full page flow validation

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ────────────────────────────┐
                                           ↓
Phase 2: Foundational ─────────────────────┤ (BLOCKS all user stories)
                                           ↓
┌──────────────────────────────────────────┴──────────────────────────────────────┐
│  Phase 3: US1 (판매 차량)    ← P1 MVP                                           │
│  Phase 4: US2 (견적 상담)    ← P1 MVP (depends on US1 for card integration)     │
│  Phase 5: US3 (히어로)       ← P2                                               │
│  Phase 6: US4 (출고 내역)    ← P2                                               │
│  Phase 7: US5 (강점)         ← P3                                               │
│  Phase 8: US6 (FAQ)          ← P3                                               │
│  Phase 9: US7 (네비게이션)   ← P2 (Header/Footer wraps all sections)            │
└─────────────────────────────────────────────────────────────────────────────────┘
                                           ↓
Phase 10: Polish ──────────────────────────┘
```

### User Story Dependencies

| Story | Priority | Dependencies | Notes |
|-------|----------|--------------|-------|
| US1 | P1 | Phase 2 | Core filtering, can start first |
| US2 | P1 | Phase 2, partial US1 | Modal needs SaleCarCard integration |
| US3 | P2 | Phase 2 | Independent |
| US4 | P2 | Phase 2 | Independent |
| US5 | P3 | Phase 2 | Independent |
| US6 | P3 | Phase 2 | Independent |
| US7 | P2 | Phase 2 | Header/Footer wraps all, can develop in parallel |

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T002, T003, T004, T005 (types) - all parallel
T006, T007 (utils) - all parallel
```

**Phase 2 (Foundational)**:
```
T008, T009, T010 (mocks) - all parallel
T011, T012, T013 (services) - all parallel
```

**Phase 3 (US1)**:
```
T017, T018, T019, T020 (components) - all parallel
```

**Cross-Story Parallel** (after Phase 2):
```
US3 (HeroSection), US4 (ReleasedCar), US5 (Strength), US6 (FAQ), US7 (Header/Footer)
- Can all be developed in parallel by different team members
```

---

## Parallel Example: Phase 2

```bash
# Launch all mock data creation together:
Task: "Create manufacturer mock data in src/data/mocks/manufacturers.ts"
Task: "Create saleCar mock data in src/data/mocks/saleCars.ts"
Task: "Create releasedCar mock data in src/data/mocks/releasedCars.ts"

# Launch all service implementations together:
Task: "Implement manufacturer.service.ts in src/data/services/manufacturer.service.ts"
Task: "Implement saleCar.service.ts in src/data/services/saleCar.service.ts"
Task: "Implement releasedCar.service.ts in src/data/services/releasedCar.service.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (types, utils, colors)
2. Complete Phase 2: Foundational (mocks, services, hooks)
3. Complete Phase 3: User Story 1 (판매 차량 탐색)
4. Complete Phase 4: User Story 2 (견적 상담 신청)
5. **STOP and VALIDATE**: Test MVP independently
6. Deploy/demo if ready

### Incremental Delivery

| Increment | Phases | Deliverable |
|-----------|--------|-------------|
| MVP | 1-4 | 판매 차량 탐색 + 견적 상담 |
| v1.1 | +5,6 | 히어로 + 출고 내역 |
| v1.2 | +7,8 | 강점 + FAQ |
| v1.3 | +9,10 | 네비게이션 + Polish |

---

## Notes

- 테스트는 스펙에서 명시적으로 요청되지 않아 제외됨
- Mock data는 실제 차량 데이터와 유사하게 구성 (국산 5-6개, 수입 5-9개 제조사)
- 모든 컴포넌트는 TailwindCSS로 스타일링
- globals.css의 색상 변수를 모든 컴포넌트에서 일관되게 사용
- 각 Phase 완료 후 독립적으로 테스트 가능
