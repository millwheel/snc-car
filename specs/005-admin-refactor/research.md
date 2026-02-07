# Research: 관리자 페이지 리팩토링

**Feature**: 005-admin-refactor | **Date**: 2026-02-07

## R1: Root Layout에서 Admin 페이지의 Header/Footer 제외 전략

**Decision**: 관리자 전용 `admin/layout.tsx`에서 독립된 레이아웃을 구성하고, 루트 `layout.tsx`에서 pathname 기반으로 Header/Footer 조건부 렌더링

**Rationale**:
- 현재 `src/app/layout.tsx`에서 `<Header />`와 `<Footer />`를 무조건 렌더링하고 있음
- Next.js App Router에서는 레이아웃이 중첩(nested)되므로, `/admin` 경로도 루트 레이아웃의 Header/Footer를 상속받음
- 해결 방법: 루트 레이아웃을 클라이언트 컴포넌트로 전환하거나, 조건부 렌더링 래퍼 컴포넌트를 사용
- `ConditionalLayout` 래퍼 컴포넌트를 만들어 `usePathname()`으로 `/admin` 경로 감지 시 Header/Footer를 숨기는 방식 채택

**Alternatives considered**:
- Route Group `(main)` 분리: 기존 파일 구조를 대규모로 변경해야 하므로 리스크가 큼
- 루트 레이아웃 자체를 클라이언트 컴포넌트로: metadata export 불가
- CSS로 숨기기: SEO 및 성능에 부정적

---

## R2: 관리자 페이지 URL 라우팅 구조

**Decision**: Next.js App Router 파일 기반 라우팅으로 다음 구조 채택

```
/admin                        → 대시보드 (기본 redirect → /admin/manufacturers)
/admin/manufacturers          → 제조사 목록
/admin/manufacturers/new      → 제조사 등록
/admin/manufacturers/[id]     → 제조사 상세
/admin/manufacturers/[id]/edit → 제조사 수정
/admin/sale-cars              → 판매차량 목록
/admin/sale-cars/new          → 판매차량 등록
/admin/sale-cars/[id]         → 판매차량 상세
/admin/sale-cars/[id]/edit    → 판매차량 수정
/admin/released-cars          → 출고차량 목록
/admin/released-cars/new      → 출고차량 등록
/admin/released-cars/[id]     → 출고차량 상세
/admin/released-cars/[id]/edit → 출고차량 수정
/admin/login                  → 로그인 (기존 유지)
```

**Rationale**:
- RESTful 리소스 패턴에 부합
- 각 페이지가 독립 URL을 가져 브라우저 히스토리/북마크 지원
- Next.js App Router의 파일 기반 라우팅과 자연스럽게 매핑

**Alternatives considered**:
- 쿼리 파라미터 기반 (`/admin?tab=manufacturers&mode=edit&id=1`): URL 구조가 불명확, 비표준적
- 해시 기반 (`/admin#manufacturers/1/edit`): SEO 불리, 서버 사이드 인지 불가

---

## R3: 페이지네이션 구현 방식

**Decision**: 서버 사이드 페이지네이션 (Supabase `.range()` 활용)

**Rationale**:
- 데이터 증가에 대비한 확장성
- Supabase의 `.range(from, to)` 메소드를 활용하여 DB 수준에서 페이징
- API에서 `page`와 `limit` 쿼리 파라미터로 제어
- 총 개수는 Supabase의 `{ count: 'exact' }` 옵션으로 조회
- 페이지당 기본 10개 항목

**Alternatives considered**:
- 클라이언트 사이드 페이지네이션: 전체 데이터를 한 번에 로드하므로 대량 데이터 시 비효율
- 무한 스크롤: 관리자 목록에는 전통적 페이지네이션이 더 적합 (전체 개수 파악, 특정 위치 이동)

---

## R4: 목록 페이지 "작성자 닉네임" 표시 전략

**Decision**: 현재 DB 스키마에 `created_by` 컬럼이 없으므로, 테이블에 `created_by` (users.id FK) 컬럼 추가

**Rationale**:
- 요구사항 FR-008에서 "작성자 닉네임"을 목록에 표시해야 함
- 현재 `manufacturers`, `sale_cars`, `released_cars` 테이블에 작성자 정보가 없음
- 각 테이블에 `created_by INT REFERENCES users(id)` 컬럼을 추가하여 작성자 추적
- 조회 시 `users` 테이블과 JOIN하여 닉네임 표시
- 기존 데이터는 `created_by`를 NULL로 유지 (nullable 컬럼)

**Alternatives considered**:
- 현재 로그인한 관리자의 닉네임을 항상 표시: 요구사항과 부합하지 않음 (작성자가 아닌 현재 사용자)
- 별도 audit 테이블 생성: 오버엔지니어링

---

## R5: 관리자 전용 헤더 컴포넌트 구현

**Decision**: `AdminHeader` 컴포넌트를 새로 생성하여 `admin/layout.tsx`에 배치

**Rationale**:
- 관리자 헤더는 메인 사이트 헤더와 완전히 다른 구성 (로고, 제조사, 판매차량, 출고차량, 로그아웃)
- `usePathname()`을 활용하여 현재 경로에 따라 활성 메뉴 하이라이트
- 기존 `AdminTabs` 컴포넌트의 역할을 `AdminHeader`가 대체

**Alternatives considered**:
- 기존 Header 수정하여 admin 모드 추가: 관심사 혼합, 메인 사이트에 영향

---

## R6: 메탈 계열 테마 색상 전략

**Decision**: globals.css에 이미 정의된 metallic 색상 체계(primary, secondary)를 관리자 UI에 적용

**Rationale**:
- 현재 globals.css에 이미 메탈 계열 색상이 정의되어 있음:
  - primary: `#4a5568` (Metallic Steel Blue)
  - secondary: `#a0aec0` (Metallic Silver)
  - bg-metallic gradient: `#f7fafc → #edf2f7 → #e2e8f0`
- 관리자 UI에서 accent 색상(`#3182ce`, 블루 계열) 사용을 제거하고 primary/secondary로 대체
- 버튼, 테이블 헤더, 활성 상태 등에 primary-dark(`#2d3748`) ~ primary-light(`#718096`) 범위 활용

**Alternatives considered**:
- 새로운 admin 전용 색상 변수 추가: 기존 변수로 충분하므로 불필요
- Tailwind 테마 확장: 이미 globals.css 변수로 충분

---

## R7: 상세 페이지 구현 패턴

**Decision**: 각 관리 대상의 `[id]/page.tsx`에서 서버 사이드로 데이터를 fetch하여 상세 정보 표시

**Rationale**:
- 기존에는 상세 페이지가 없었고, 목록에서 바로 수정 폼으로 전환되는 구조
- 새 구조에서는 목록 → 상세 → 수정 흐름으로 변경
- 상세 페이지에서는 읽기 전용으로 정보를 표시하고, 수정/삭제 버튼을 제공
- API 엔드포인트: 기존 GET `[id]` 라우트가 없으므로 개별 조회 API 추가 필요

**Alternatives considered**:
- 클라이언트 사이드에서 목록 데이터 캐싱: 페이지 새로고침 시 데이터 유실
