# Tasks: Admin CMS 관리 페이지

**Input**: Design documents from `/specs/002-admin-cms/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — 수동 테스트만 수행 (기존 프로젝트에 테스트 프레임워크 미설정)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project (Next.js App Router)**: `src/` at repository root
- Paths use `src/` prefix per existing project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, create Supabase client utilities, define shared types

- [x] T001 Install `@supabase/ssr` package via `npm install @supabase/ssr`
- [x] T002 [P] Create browser Supabase client in `src/lib/supabase/client.ts` using `createBrowserClient()` from `@supabase/ssr` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] T003 [P] Create server Supabase client in `src/lib/supabase/server.ts` using `createServerClient()` from `@supabase/ssr` with Next.js `cookies()` API for cookie management
- [x] T004 [P] Create Supabase middleware helper in `src/lib/supabase/middleware.ts` using `createServerClient()` with `NextRequest`/`NextResponse` cookie handling for session refresh
- [x] T005 [P] Define Admin DB types in `src/types/admin.ts`: `ManufacturerRow`, `SaleCarRow`, `ReleasedCarRow` interfaces matching snake_case DB schema from data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Authentication middleware and shared Admin UI components that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Next.js middleware in `src/middleware.ts` that: (1) matches `/admin/:path*` routes, (2) calls Supabase middleware helper to refresh session, (3) checks `supabase.auth.getUser()`, (4) redirects unauthenticated users to `/admin/login`, (5) allows `/admin/login` without auth. Export `config.matcher` for `/admin/:path*`
- [x] T007 Create Admin layout in `src/app/admin/layout.tsx`: minimal layout wrapper for admin pages (no Header/Footer from main site), include admin-specific metadata title "S&C Admin"
- [x] T008 [P] Create reusable ImageUpload component in `src/components/admin/ImageUpload.tsx`: file input with preview (blob URL), accepts allowed formats (SVG/WebP/PNG/JPG), validates 5MB max size, displays selected image preview, returns File object to parent via onChange callback. Client Component with `'use client'`
- [x] T009 [P] Create DeleteConfirmModal component in `src/components/admin/DeleteConfirmModal.tsx`: modal overlay with confirm/cancel buttons, receives `isOpen`, `onConfirm`, `onCancel`, `itemName` props. Client Component with `'use client'`
- [x] T010 [P] Create AdminTabs component in `src/components/admin/AdminTabs.tsx`: tab navigation with 3 tabs (제조사 관리, 판매차량 관리, 출고차량 관리), receives `activeTab` and `onTabChange` props, style with TailwindCSS using existing theme colors (primary, accent, border). Client Component with `'use client'`

**Checkpoint**: Foundation ready — Supabase client, middleware auth, and shared admin UI components are in place

---

## Phase 3: User Story 1 — 관리자 로그인 (Priority: P1) MVP

**Goal**: 관리자가 이메일/비밀번호로 로그인하여 Admin 대시보드에 접근할 수 있다

**Independent Test**: `/admin/login`에서 로그인 → `/admin` 대시보드 접근 확인. 미로그인 시 `/admin` 접근하면 `/admin/login`으로 리다이렉트 확인

### Implementation for User Story 1

- [x] T011 [US1] Create LoginForm component in `src/components/admin/LoginForm.tsx`: email/password input fields, submit handler that calls `supabase.auth.signInWithPassword()` using browser client from `src/lib/supabase/client.ts`, display error message on failure, `router.push('/admin')` on success, `router.refresh()` to update middleware session. Client Component with `'use client'`
- [x] T012 [US1] Create login page in `src/app/admin/login/page.tsx`: render LoginForm component, center on page, style consistent with existing theme (bg-primary, card style with shadow)
- [x] T013 [US1] Create Admin dashboard page in `src/app/admin/page.tsx`: import AdminTabs, manage `activeTab` state with `useState`, conditionally render placeholder content per tab (actual tab content will be implemented in US2-US4). Client Component with `'use client'`

**Checkpoint**: User Story 1 complete — Login flow works, middleware protects `/admin`, dashboard shows tab skeleton

---

## Phase 4: User Story 2 — 제조사 관리 (Priority: P2)

**Goal**: 관리자가 제조사를 목록 조회, 등록, 수정할 수 있다 (삭제 불가). 로고 이미지 업로드 포함

**Independent Test**: 로그인 후 제조사 탭에서 제조사 등록(로고 포함) → 목록에 표시 확인 → 수정 후 반영 확인. 삭제 버튼이 없음을 확인

### Implementation for User Story 2

- [x] T014 [P] [US2] Create Manufacturers POST route handler in `src/app/api/admin/manufacturers/route.ts`: (1) auth check via `createServerClient` + `getUser()`, (2) parse `formData()`, (3) validate fields (code required+unique, name required, category DOMESTIC|IMPORT, sort_order >= 0), (4) if logo file exists: validate size/format → upload to Storage `manufacturers/{uuid}/logo.{ext}`, (5) DB insert into `manufacturers` table with logo_path, (6) on DB failure: delete uploaded image from Storage (compensation), (7) return 201 with created row. Also export GET handler to fetch all manufacturers ordered by `sort_order ASC`
- [x] T015 [P] [US2] Create Manufacturers PUT route handler in `src/app/api/admin/manufacturers/[id]/route.ts`: (1) auth check, (2) fetch existing record by id (404 if not found), (3) parse formData, (4) validate fields + code uniqueness (excluding current id), (5) if new logo: upload to Storage (overwrite path), (6) DB update with `updated_at = new Date().toISOString()`, (7) on DB failure: rollback new image if uploaded, (8) return 200 with updated row
- [x] T016 [US2] Create ManufacturerList component in `src/components/admin/ManufacturerList.tsx`: fetch manufacturers from Supabase (client-side query, `sort_order ASC`), display table/card list with logo thumbnail, name, code, category badge, sort_order, visibility toggle icon, edit button (no delete button). Receives `onEdit(manufacturer)` callback. Client Component with `'use client'`
- [x] T017 [US2] Create ManufacturerForm component in `src/components/admin/ManufacturerForm.tsx`: form fields for code, name, category (DOMESTIC/IMPORT select), sort_order (number input), is_visible (checkbox/toggle), logo upload (using ImageUpload component). Supports both create and edit modes (receives optional `manufacturer` prop for edit). On submit: build FormData with all fields + file → POST or PUT to `/api/admin/manufacturers[/id]`. Show loading state and error messages. Client Component with `'use client'`
- [x] T018 [US2] Integrate manufacturer management into Admin dashboard `src/app/admin/page.tsx`: when 제조사 관리 tab is active, render ManufacturerList + ManufacturerForm. Add state for create/edit mode toggling. After successful create/edit, refresh the list

**Checkpoint**: User Story 2 complete — Manufacturers can be listed, created with logo, and edited. No delete button visible

---

## Phase 5: User Story 3 — 판매차량 관리 (Priority: P3)

**Goal**: 관리자가 판매차량을 목록 조회, 등록(제조사 필수 선택), 수정, 삭제할 수 있다. 썸네일 이미지 업로드 포함

**Independent Test**: 로그인 후 판매차량 탭에서 제조사 선택 + 차량 등록(썸네일 포함) → 목록에 표시 확인 → 수정/삭제 확인. 제조사 미선택 시 저장 차단 확인

### Implementation for User Story 3

- [x] T019 [P] [US3] Create Sale Cars POST route handler in `src/app/api/admin/sale-cars/route.ts`: (1) auth check, (2) parse formData, (3) validate fields (manufacturer_id required + verify exists in manufacturers table, name required, rent_price/lease_price nullable int, badges JSON array parse), (4) if thumbnail: validate → upload to Storage `sale-cars/{uuid}/thumb.{ext}`, (5) DB insert into `sale_cars`, (6) compensation on DB failure, (7) return 201. Also export GET handler to fetch all sale_cars with `manufacturers(name)` join, ordered by `created_at DESC`
- [x] T020 [P] [US3] Create Sale Cars PUT/DELETE route handler in `src/app/api/admin/sale-cars/[id]/route.ts`: PUT: (1) auth, (2) fetch existing (404), (3) parse+validate, (4) optional new thumbnail upload (overwrite), (5) DB update with `updated_at`, (6) compensation on failure. DELETE: (1) auth, (2) fetch existing (404), (3) DB delete, (4) on success: delete thumbnail from Storage if exists, (5) return 200
- [x] T021 [US3] Create SaleCarList component in `src/components/admin/SaleCarList.tsx`: fetch sale_cars with manufacturer name join from Supabase (client-side, `created_at DESC`), display table/card with thumbnail, name, manufacturer name, rent/lease prices (or "비용문의"), badges, visibility, edit and delete buttons. On delete click: show DeleteConfirmModal → call DELETE API. Client Component with `'use client'`
- [x] T022 [US3] Create SaleCarForm component in `src/components/admin/SaleCarForm.tsx`: form fields for manufacturer_id (select dropdown populated from manufacturers query), name, description (textarea), rent_price, lease_price (number inputs, empty = null), badges (multi-select or tag input for '즉시출고'/'프로모션'), is_visible (checkbox), thumbnail (ImageUpload). Create/edit modes. FormData submit to POST/PUT. Client Component with `'use client'`
- [x] T023 [US3] Integrate sale car management into Admin dashboard `src/app/admin/page.tsx`: when 판매차량 관리 tab is active, render SaleCarList + SaleCarForm. Add create/edit/list mode state management. Refresh list after create/edit/delete

**Checkpoint**: User Story 3 complete — Sale cars can be listed, created (with mandatory manufacturer), edited, and deleted with confirmation

---

## Phase 6: User Story 4 — 출고차량 관리 (Priority: P4)

**Goal**: 관리자가 출고차량을 목록 조회, 등록, 수정, 삭제할 수 있다. 썸네일 이미지 업로드 및 출고일 지정 포함

**Independent Test**: 로그인 후 출고차량 탭에서 차량 등록(출고일 + 썸네일) → 목록에 표시 확인 → 수정/삭제 확인

### Implementation for User Story 4

- [x] T024 [P] [US4] Create Released Cars POST route handler in `src/app/api/admin/released-cars/route.ts`: (1) auth check, (2) parse formData, (3) validate (car_name required, released_at required valid date YYYY-MM-DD, is_visible), (4) if thumbnail: validate → upload to Storage `released-cars/{uuid}/thumb.{ext}`, (5) DB insert into `released_cars`, (6) compensation on DB failure, (7) return 201. Also export GET handler to fetch all released_cars ordered by `created_at DESC`
- [x] T025 [P] [US4] Create Released Cars PUT/DELETE route handler in `src/app/api/admin/released-cars/[id]/route.ts`: PUT: (1) auth, (2) fetch existing (404), (3) parse+validate, (4) optional new thumbnail, (5) DB update with `updated_at`, (6) compensation. DELETE: (1) auth, (2) fetch existing (404), (3) DB delete, (4) delete thumbnail from Storage if exists, (5) return 200
- [x] T026 [US4] Create ReleasedCarList component in `src/components/admin/ReleasedCarList.tsx`: fetch released_cars from Supabase (client-side, `created_at DESC`), display table/card with thumbnail, car_name, released_at (formatted date), visibility, edit and delete buttons. On delete: show DeleteConfirmModal → call DELETE API. Client Component with `'use client'`
- [x] T027 [US4] Create ReleasedCarForm component in `src/components/admin/ReleasedCarForm.tsx`: form fields for car_name, released_at (date input), is_visible (checkbox), thumbnail (ImageUpload). Create/edit modes. FormData submit to POST/PUT. Client Component with `'use client'`
- [x] T028 [US4] Integrate released car management into Admin dashboard `src/app/admin/page.tsx`: when 출고차량 관리 tab is active, render ReleasedCarList + ReleasedCarForm. Add create/edit/list mode state management. Refresh list after create/edit/delete

**Checkpoint**: User Story 4 complete — Released cars can be listed, created, edited, and deleted with confirmation

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality improvements across all stories

- [x] T029 Review all route handlers for consistent error response format (`{ error: string }`) and proper HTTP status codes (401/400/404/409/500) in `src/app/api/admin/` directory
- [x] T030 [P] Add loading states and disabled button states during form submissions across all admin form components (`ManufacturerForm.tsx`, `SaleCarForm.tsx`, `ReleasedCarForm.tsx`, `LoginForm.tsx`)
- [x] T031 [P] Add Storage image URL helper utility to construct public image URLs from path: `getPublicImageUrl(path: string): string` using `NEXT_PUBLIC_SUPABASE_URL` + `/storage/v1/object/public/{bucket}/` pattern, in `src/lib/supabase/storage.ts`
- [x] T032 Verify build succeeds with `npm run build` and fix any TypeScript or lint errors
- [ ] T033 Run quickstart.md validation: verify login flow, all 3 tabs CRUD operations, image upload/display, and compensation logic by testing DB insert failure scenario

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001-T005) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 — BLOCKS user stories 2-4 (login required)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (login) — BLOCKS User Story 3 (manufacturer FK)
- **User Story 3 (Phase 5)**: Depends on Phase 4 (manufacturers must exist for FK)
- **User Story 4 (Phase 6)**: Depends on Phase 3 only (independent entity, no FK) — can run in parallel with US2/US3
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 관리자 로그인 (P1)**: After Foundational → no other story dependencies
- **US2 제조사 관리 (P2)**: After US1 (login required) → no other story dependencies
- **US3 판매차량 관리 (P3)**: After US2 (manufacturer_id FK requires manufacturers to exist)
- **US4 출고차량 관리 (P4)**: After US1 only (independent entity) → can run in parallel with US2/US3

### Within Each User Story

- Route handlers ([P] tasks) before UI components
- List component before Form component
- Integration into dashboard page last

### Parallel Opportunities

- T002, T003, T004, T005 (Phase 1 Supabase clients + types) — all different files
- T008, T009, T010 (Phase 2 shared components) — all different files
- T014, T015 (US2 route handlers) — different route files
- T019, T020 (US3 route handlers) — different route files
- T024, T025 (US4 route handlers) — different route files
- US4 can run in parallel with US2/US3 (no FK dependency)

---

## Parallel Example: User Story 2

```bash
# Launch route handlers in parallel (different files):
Task: "T014 — POST route handler in src/app/api/admin/manufacturers/route.ts"
Task: "T015 — PUT route handler in src/app/api/admin/manufacturers/[id]/route.ts"

# Then sequentially:
Task: "T016 — ManufacturerList component"
Task: "T017 — ManufacturerForm component"
Task: "T018 — Integrate into dashboard"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install @supabase/ssr, create clients, define types)
2. Complete Phase 2: Foundational (middleware, admin layout, shared components)
3. Complete Phase 3: User Story 1 (login + dashboard skeleton)
4. **STOP and VALIDATE**: Test login → redirect → dashboard access
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Login) → Test login flow → Deploy (MVP!)
3. Add US2 (Manufacturers) → Test CRUD + logo upload → Deploy
4. Add US3 (Sale Cars) → Test CRUD + thumbnail + manufacturer FK → Deploy
5. Add US4 (Released Cars) → Test CRUD + thumbnail → Deploy
6. Polish → Final validation → Deploy
7. Each story adds value without breaking previous stories

### Single Developer Strategy (Recommended)

순서대로 진행: Phase 1 → Phase 2 → US1 → US2 → US3 → US4 → Polish

각 Phase 완료 후 `npm run build`로 빌드 확인하면서 점진적으로 진행.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- 모든 route handler에서 `auth.getUser()` 인증 검증 필수
- 이미지 업로드 → DB 저장 → 실패 시 보상 로직 패턴을 모든 route handler에 동일하게 적용
- `@supabase/supabase-js` 직접 import 금지 — 반드시 `@supabase/ssr`의 `createBrowserClient`/`createServerClient` 사용
- DB에는 이미지 path만 저장 (URL 아님). 클라이언트에서 표시할 때 URL 변환 필요
- 기존 메인 페이지 코드(`src/app/page.tsx`, `src/app/layout.tsx`, `src/components/` 기존 파일)는 일체 변경하지 않음
