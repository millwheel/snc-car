# Tasks: 관리자 페이지 리팩토링

**Input**: Design documents from `/specs/005-admin-refactor/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not requested - test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project (Next.js)**: `src/` at repository root
- Pages: `src/app/admin/`
- Components: `src/components/admin/`, `src/components/layout/`
- API Routes: `src/app/api/admin/`
- Types: `src/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: DB 스키마 변경 및 공유 타입 업데이트

- [x] T001 DB 마이그레이션 실행: manufacturers, sale_cars, released_cars 테이블에 `created_by INT REFERENCES users(id) ON DELETE SET NULL` 컬럼 추가 (Supabase SQL Editor)
- [x] T002 타입 정의 업데이트: `created_by` 필드 추가, WithAuthor 타입, PaginatedResponse 제네릭 타입 추가 in `src/types/admin.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 관리자 레이아웃 구조 변경 - 모든 User Story의 전제 조건

**⚠️ CRITICAL**: 이 Phase가 완료되어야 관리 대상별 페이지 분리 작업이 가능

- [x] T003 ConditionalLayout 컴포넌트 생성: `usePathname()`으로 `/admin` 경로 감지 시 Header/Footer를 숨기는 클라이언트 컴포넌트 in `src/components/layout/ConditionalLayout.tsx`
- [x] T004 루트 레이아웃 수정: Header/Footer 직접 렌더링을 ConditionalLayout 래퍼로 교체 in `src/app/layout.tsx`
- [x] T005 Pagination 공용 컴포넌트 생성: page, totalPages, onPageChange props를 받는 재사용 가능한 페이지네이션 UI in `src/components/admin/Pagination.tsx`

**Checkpoint**: 관리자 페이지에서 메인 헤더/푸터가 숨겨지고, Pagination 컴포넌트가 준비됨

---

## Phase 3: User Story 1 - 관리자 전용 헤더를 통한 페이지 내비게이션 (Priority: P1) 🎯 MVP

**Goal**: 관리자 전용 헤더(로고, 제조사, 판매차량, 출고차량, 로그아웃)를 구현하여 탭 기반 내비게이션을 URL 기반으로 전환

**Independent Test**: 로그인 후 관리자 헤더가 표시되고, 각 메뉴 클릭 시 해당 URL로 이동하며, 현재 페이지 메뉴가 하이라이트되는지 확인

### Implementation for User Story 1

- [x] T006 [US1] AdminHeader 컴포넌트 생성: 좌측부터 logo.png(→ `/` 이동), 제조사(`/admin/manufacturers`), 판매차량(`/admin/sale-cars`), 출고차량(`/admin/released-cars`), 로그아웃 버튼 배치. `usePathname()`으로 현재 경로 메뉴 하이라이트. 메탈 계열 색상(primary-dark 배경) 적용 in `src/components/admin/AdminHeader.tsx`
- [x] T007 [US1] admin layout.tsx 수정: AdminHeader를 레이아웃에 추가하고, login 페이지에서는 AdminHeader를 숨기는 조건부 렌더링 적용 in `src/app/admin/layout.tsx`
- [x] T008 [US1] admin page.tsx 수정: 기존 탭 기반 대시보드를 `/admin/manufacturers`로 redirect하는 간단한 리다이렉트 페이지로 교체 in `src/app/admin/page.tsx`

**Checkpoint**: 관리자 로그인 후 전용 헤더가 표시되고, 각 메뉴 클릭 시 해당 경로로 이동됨 (아직 대상 페이지는 생성 전)

---

## Phase 4: User Story 2 - 관리 대상별 별도 페이지 분리 (Priority: P1)

**Goal**: 제조사/판매차량/출고차량 각각 목록·등록·수정 페이지를 독립 URL로 분리

**Independent Test**: 각 관리 대상의 목록/등록/수정 페이지에 URL로 직접 접근하여 기능이 동작하는지 확인

### API 수정

- [x] T009 [P] [US2] 제조사 API GET 수정: page/limit 쿼리 파라미터 지원, `users(nickname)` JOIN, PaginatedResponse 형식 반환, `{ count: 'exact' }` 옵션 추가 in `src/app/api/admin/manufacturers/route.ts`
- [x] T010 [P] [US2] 제조사 API POST 수정: `getSessionUser()`로 현재 사용자 조회 후 `created_by` 자동 기록 in `src/app/api/admin/manufacturers/route.ts`
- [x] T011 [P] [US2] 제조사 단일 조회 GET 추가: manufacturer_id로 단일 제조사 조회, `users(nickname)` JOIN, 404 처리 in `src/app/api/admin/manufacturers/[id]/route.ts`
- [x] T012 [P] [US2] 판매차량 API GET 수정: page/limit 지원, `manufacturers(name)` + `users(nickname)` JOIN, PaginatedResponse 반환 in `src/app/api/admin/sale-cars/route.ts`
- [x] T013 [P] [US2] 판매차량 API POST 수정: `created_by` 자동 기록 in `src/app/api/admin/sale-cars/route.ts`
- [x] T014 [P] [US2] 판매차량 단일 조회 GET 추가: sale_car_id로 조회, `manufacturers(name)` + `users(nickname)` JOIN, 404 처리 in `src/app/api/admin/sale-cars/[id]/route.ts`
- [x] T015 [P] [US2] 출고차량 API GET 수정: page/limit 지원, `users(nickname)` JOIN, PaginatedResponse 반환 in `src/app/api/admin/released-cars/route.ts`
- [x] T016 [P] [US2] 출고차량 API POST 수정: `created_by` 자동 기록 in `src/app/api/admin/released-cars/route.ts`
- [x] T017 [P] [US2] 출고차량 단일 조회 GET 추가: released_car_id로 조회, `users(nickname)` JOIN, 404 처리 in `src/app/api/admin/released-cars/[id]/route.ts`

### 제조사 페이지

- [x] T018 [US2] 제조사 목록 페이지 생성: API에서 paginated 데이터 fetch, 테이블(이름, 작성자 닉네임, 작성날짜 YYYY-MM-DD), 등록 버튼(`/admin/manufacturers/new`), 행 클릭 시 상세(`/admin/manufacturers/[id]`), Pagination 컴포넌트 사용 in `src/app/admin/manufacturers/page.tsx`
- [x] T019 [US2] 제조사 등록 페이지 생성: 기존 ManufacturerForm 재사용, onSuccess 시 `/admin/manufacturers`로 이동, onCancel 시 뒤로가기 in `src/app/admin/manufacturers/new/page.tsx`
- [x] T020 [US2] 제조사 수정 페이지 생성: params에서 id 추출, API로 기존 데이터 fetch, ManufacturerForm에 manufacturer prop 전달, onSuccess 시 상세 페이지로 이동 in `src/app/admin/manufacturers/[id]/edit/page.tsx`

### 판매차량 페이지

- [x] T021 [P] [US2] 판매차량 목록 페이지 생성: 테이블(차량명, 작성자 닉네임, 작성날짜), 등록 버튼(`/admin/sale-cars/new`), 행 클릭 시 상세, Pagination 사용 in `src/app/admin/sale-cars/page.tsx`
- [x] T022 [P] [US2] 판매차량 등록 페이지 생성: SaleCarForm 재사용 in `src/app/admin/sale-cars/new/page.tsx`
- [x] T023 [P] [US2] 판매차량 수정 페이지 생성: params에서 id 추출, 기존 데이터 fetch, SaleCarForm에 saleCar prop 전달 in `src/app/admin/sale-cars/[id]/edit/page.tsx`

### 출고차량 페이지

- [x] T024 [P] [US2] 출고차량 목록 페이지 생성: 테이블(차량명, 작성자 닉네임, 작성날짜), 등록 버튼(`/admin/released-cars/new`), 행 클릭 시 상세, Pagination 사용 in `src/app/admin/released-cars/page.tsx`
- [x] T025 [P] [US2] 출고차량 등록 페이지 생성: ReleasedCarForm 재사용 in `src/app/admin/released-cars/new/page.tsx`
- [x] T026 [P] [US2] 출고차량 수정 페이지 생성: params에서 id 추출, 기존 데이터 fetch, ReleasedCarForm에 releasedCar prop 전달 in `src/app/admin/released-cars/[id]/edit/page.tsx`

### Form 컴포넌트 수정

- [x] T027 [US2] ManufacturerForm 수정: onSuccess/onCancel 콜백이 router.push() 기반으로 동작하도록 수정, 페이지 독립 사용 지원 in `src/components/admin/ManufacturerForm.tsx`
- [x] T028 [P] [US2] SaleCarForm 수정: 동일하게 router.push() 기반 네비게이션 지원 in `src/components/admin/SaleCarForm.tsx`
- [x] T029 [P] [US2] ReleasedCarForm 수정: 동일하게 router.push() 기반 네비게이션 지원 in `src/components/admin/ReleasedCarForm.tsx`

**Checkpoint**: 제조사/판매차량/출고차량의 목록·등록·수정 페이지가 독립 URL로 동작

---

## Phase 5: User Story 3 - 목록 페이지 페이지네이션 및 정보 표시 (Priority: P2)

**Goal**: 목록 페이지에 페이지네이션 적용 및 각 행에 제목·작성자·작성날짜 표시

**Independent Test**: 목록 데이터가 10건 초과 시 페이지네이션이 표시되고, 페이지 이동이 동작하며, 각 행에 올바른 형식의 정보가 표시되는지 확인

> **Note**: Phase 4(US2)에서 목록 페이지와 API에 이미 페이지네이션 기본 구조가 포함됨. 이 Phase에서는 정상 동작 검증 및 빈 상태/경계 케이스를 처리.

### Implementation for User Story 3

- [x] T030 [US3] 제조사 목록 빈 상태 처리: 데이터 0건일 때 "등록된 제조사가 없습니다" 안내 표시, 페이지네이션 숨김 in `src/app/admin/manufacturers/page.tsx`
- [x] T031 [P] [US3] 판매차량 목록 빈 상태 처리: 데이터 0건일 때 빈 상태 안내, 페이지네이션 숨김 in `src/app/admin/sale-cars/page.tsx`
- [x] T032 [P] [US3] 출고차량 목록 빈 상태 처리: 데이터 0건일 때 빈 상태 안내, 페이지네이션 숨김 in `src/app/admin/released-cars/page.tsx`

**Checkpoint**: 모든 목록 페이지에서 페이지네이션과 정보 표시가 정상 동작

---

## Phase 6: User Story 4 - 상세 페이지에서 수정 및 삭제 (Priority: P2)

**Goal**: 각 관리 대상의 상세 페이지에서 데이터 조회, 수정 페이지 이동, 삭제 기능 제공

**Independent Test**: 상세 페이지 URL 접근 시 데이터가 표시되고, 수정 버튼 클릭 시 수정 페이지로 이동, 삭제 시 확인 모달 후 삭제 완료되어 목록으로 이동하는지 확인

### Implementation for User Story 4

- [x] T033 [P] [US4] 제조사 상세 페이지 생성: API로 단일 제조사 데이터 fetch, 전체 정보(코드, 이름, 카테고리, 로고, 정렬순서, 노출여부, 작성자, 작성일) 표시, 수정 버튼(`/admin/manufacturers/[id]/edit`), 목록으로 돌아가기 버튼 in `src/app/admin/manufacturers/[id]/page.tsx`
- [x] T034 [P] [US4] 판매차량 상세 페이지 생성: 전체 정보(제조사, 차량명, 설명, 가격, 뱃지, 썸네일, 노출여부, 작성자, 작성일) 표시, 수정 버튼(`/admin/sale-cars/[id]/edit`), 삭제 버튼(DeleteConfirmModal 연동), 삭제 시 `/admin/sale-cars`로 이동 in `src/app/admin/sale-cars/[id]/page.tsx`
- [x] T035 [P] [US4] 출고차량 상세 페이지 생성: 전체 정보(차량명, 출고일, 썸네일, 노출여부, 작성자, 작성일) 표시, 수정 버튼(`/admin/released-cars/[id]/edit`), 삭제 버튼(DeleteConfirmModal 연동), 삭제 시 `/admin/released-cars`로 이동 in `src/app/admin/released-cars/[id]/page.tsx`
- [x] T036 [US4] 존재하지 않는 ID 접근 시 에러 처리: 상세 및 수정 페이지에서 404 응답 시 "데이터를 찾을 수 없습니다" 안내 또는 목록 페이지로 redirect in `src/app/admin/manufacturers/[id]/page.tsx`, `src/app/admin/sale-cars/[id]/page.tsx`, `src/app/admin/released-cars/[id]/page.tsx`

**Checkpoint**: 상세 페이지에서 조회·수정·삭제 플로우가 정상 동작

---

## Phase 7: User Story 5 - 메탈 계열 테마 색상 적용 (Priority: P3)

**Goal**: 관리자 페이지 전체에 블루 계열 → 메탈 계열 색상 통일

**Independent Test**: 관리자 페이지에서 블루(accent) 계열 색상이 사라지고, primary/secondary 메탈 계열 색상만 사용되는지 시각적 확인

### Implementation for User Story 5

- [x] T037 [US5] AdminHeader 메탈 테마 점검: 이미 T006에서 primary-dark 배경 적용됨. accent 색상 잔여 사용 제거 및 hover/active 상태 메탈 색상 확인 in `src/components/admin/AdminHeader.tsx`
- [x] T038 [P] [US5] 목록 페이지 메탈 테마 적용: 테이블 헤더 bg-primary-dark/text-white, 행 hover bg-bg-secondary, 등록 버튼 bg-primary hover:bg-primary-dark, 페이지네이션 활성 색상 primary in `src/app/admin/manufacturers/page.tsx`, `src/app/admin/sale-cars/page.tsx`, `src/app/admin/released-cars/page.tsx`
- [x] T039 [P] [US5] 상세 페이지 메탈 테마 적용: 수정/삭제 버튼 스타일을 primary/secondary 기반으로, 카드 배경 bg-bg-card, 라벨 text-text-secondary in `src/app/admin/manufacturers/[id]/page.tsx`, `src/app/admin/sale-cars/[id]/page.tsx`, `src/app/admin/released-cars/[id]/page.tsx`
- [x] T040 [P] [US5] 폼 페이지 메탈 테마 적용: 입력 필드 focus:ring-primary, 제출 버튼 bg-primary, 취소 버튼 bg-secondary in `src/components/admin/ManufacturerForm.tsx`, `src/components/admin/SaleCarForm.tsx`, `src/components/admin/ReleasedCarForm.tsx`
- [x] T041 [US5] 로그인 페이지 메탈 테마 적용: accent 색상을 primary로 교체 in `src/app/admin/login/page.tsx`, `src/components/admin/LoginForm.tsx`

**Checkpoint**: 관리자 페이지 전체가 메탈 계열 색상으로 통일

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 미사용 컴포넌트 정리 및 최종 검증

- [x] T042 미사용 컴포넌트 제거: AdminTabs.tsx, ManufacturerList.tsx, SaleCarList.tsx, ReleasedCarList.tsx 삭제 in `src/components/admin/`
- [x] T043 빌드 검증: `npm run build` 실행하여 타입 에러 및 빌드 오류 없는지 확인
- [x] T044 전체 플로우 수동 검증: quickstart.md의 Key URLs 전체 순회하여 정상 동작 확인

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - DB 마이그레이션 및 타입 업데이트
- **Foundational (Phase 2)**: Phase 1 완료 후 - ConditionalLayout, Pagination 생성
- **US1 (Phase 3)**: Phase 2 완료 후 - AdminHeader 및 레이아웃 구조 변경
- **US2 (Phase 4)**: Phase 3 완료 후 - 페이지 분리 (AdminHeader 내비게이션 대상 필요)
- **US3 (Phase 5)**: Phase 4 완료 후 - 목록 페이지 빈 상태 및 경계 케이스
- **US4 (Phase 6)**: Phase 4 완료 후 - 상세 페이지 생성 (US3과 병렬 가능)
- **US5 (Phase 7)**: Phase 4 완료 후 - 테마 적용 (US3, US4와 병렬 가능)
- **Polish (Phase 8)**: Phase 3~7 모두 완료 후

### User Story Dependencies

- **US1 (P1)**: Foundational 완료 후 시작 가능 - 다른 Story에 대한 의존 없음
- **US2 (P1)**: US1 완료 후 시작 (AdminHeader 내비게이션이 가리킬 페이지 생성)
- **US3 (P2)**: US2 완료 후 시작 (목록 페이지 존재 필요)
- **US4 (P2)**: US2 완료 후 시작 (US3과 병렬 가능)
- **US5 (P3)**: US2 완료 후 시작 (US3, US4와 병렬 가능)

### Parallel Opportunities

**Phase 4 내 병렬 작업**:
- T009~T017 (API 수정): 모든 API route 수정이 서로 다른 파일이므로 병렬 가능
- T021~T026: 판매차량/출고차량 페이지들은 제조사 페이지와 병렬 가능
- T027~T029: Form 수정은 서로 다른 파일이므로 병렬 가능

**Phase 5~7 병렬 작업**:
- US3, US4, US5는 US2 완료 후 서로 병렬로 진행 가능

---

## Parallel Example: User Story 2

```bash
# API 수정 - 모든 route 파일이 독립적이므로 동시 작업 가능:
Task: "T009 제조사 API GET 수정 in src/app/api/admin/manufacturers/route.ts"
Task: "T012 판매차량 API GET 수정 in src/app/api/admin/sale-cars/route.ts"
Task: "T015 출고차량 API GET 수정 in src/app/api/admin/released-cars/route.ts"

# 페이지 생성 - 관리 대상별 독립 파일:
Task: "T018 제조사 목록 in src/app/admin/manufacturers/page.tsx"
Task: "T021 판매차량 목록 in src/app/admin/sale-cars/page.tsx"
Task: "T024 출고차량 목록 in src/app/admin/released-cars/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Phase 1: Setup (DB 마이그레이션 + 타입)
2. Phase 2: Foundational (ConditionalLayout + Pagination)
3. Phase 3: US1 (AdminHeader + 레이아웃)
4. Phase 4: US2 (페이지 분리 - 핵심 기능)
5. **STOP and VALIDATE**: 목록·등록·수정 기능이 독립 URL로 동작하는지 검증

### Incremental Delivery

1. Setup + Foundational → 기반 준비
2. US1 → AdminHeader 동작 확인 (MVP 시작)
3. US2 → 페이지 분리 완료 (핵심 MVP)
4. US3 + US4 (병렬) → 페이지네이션 + 상세 페이지
5. US5 → 메탈 테마 적용 (최종 마무리)
6. Polish → 정리 및 검증

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- 기존 Form 컴포넌트(ManufacturerForm, SaleCarForm, ReleasedCarForm)를 최대한 재사용
- 기존 API 엔드포인트의 POST/PUT/DELETE는 유지하되 GET만 확장
- Commit after each phase completion
