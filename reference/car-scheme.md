# sale_cars 스키마 변경: badges -> immediate

## 변경 요약
- `badges text[]` 컬럼 제거
- `immediate boolean` 컬럼 추가 (즉시출고 여부)
- 프로모션 뱃지 개념 완전 제거
- DB는 이미 변경 완료 -> API/UI만 반영

---

## 수정 대상 파일 목록

### 1. 타입 정의

**`src/types/admin.ts:21`** - `SaleCarRow`
- `badges: string[]` -> `immediate: boolean`

**`src/types/saleCar.ts`** - 전체 수정
- `SaleCarBadge` enum 삭제 (IMMEDIATE, PROMOTION 모두 불필요)
- `SaleCar` 인터페이스: `badges: string[]` -> `immediate: boolean`

### 2. Admin API

**`src/app/api/admin/sale-cars/route.ts`** - POST (생성)
- L61: `badgesRaw` FormData 파싱 제거
- L84-92: badges JSON 파싱 로직 제거
- L132: insert 객체에서 `badges` -> `immediate` (boolean) 
- FormData에서 `immediate` 값 읽기 추가 (`'true'`/`'false'` 문자열 파싱)

**`src/app/api/admin/sale-cars/[id]/route.ts`** - PUT (수정)
- L70: `badgesRaw` FormData 파싱 제거
- L81-83: badges JSON 파싱 로직 제거
- L117: update 객체에서 `badges` -> `immediate`
- FormData에서 `immediate` 값 읽기 추가

### 3. Public API

**`src/app/api/public/sale-cars/route.ts`** - GET (메인 페이지용)
- L10: select 쿼리에서 `badges` -> `immediate`
- L28: 변환 로직에서 `badges: row.badges ?? []` -> `immediate: row.immediate ?? false`

### 4. Admin UI

**`src/components/admin/SaleCarForm.tsx`** - 판매차량 등록/수정 폼
- L8: `BADGE_OPTIONS` 상수 삭제
- L24: `badges` state -> `immediate` boolean state
- L46: 초기값 로딩에서 `setBadges` -> `setImmediate`
- L54: 리셋에서 `setBadges([])` -> `setImmediate(false)` (기본값이 false)
- L61-65: `toggleBadge` 함수 삭제
- L89: FormData에 `badges` JSON -> `immediate` 문자열 append
- L193-211: 배지 토글 버튼 UI -> 즉시출고 체크박스 UI로 변경

**`src/app/admin/sale-cars/[id]/page.tsx`** - 판매차량 상세 페이지
- L102-113: 배지 표시 영역 -> 즉시출고 여부 표시 (O/X 또는 텍스트)

### 5. Public UI (메인 페이지 카드)

**`src/components/cards/SaleCarCard.tsx`** - 차량 카드 컴포넌트
- L3: `SaleCarBadge` import 제거
- L10-19: `getBadgeColor()` 함수 삭제
- L47-59: 뱃지 영역 -> `immediate`일 때만 "즉시출고" 뱃지 1개 표시

### 6. CSS

**`src/app/globals.css:51`**
- `--color-badge-promotion` 삭제
- `--color-badge-immediate`는 유지 (즉시출고 뱃지 색상으로 계속 사용)
- `QuoteModal.tsx`에서 에러 표시 색상으로 사용중인 --color-badge-immediate 대신 별도의 에러 색상 표시 컬러를 globals.css에 정의
- 에러 색상은 모두 globals.css에서 새로 정의한 에러 색상을 사용하도록 리팩토링
- `--color-badge-promotion`은 `QuoteModal.tsx:202,205`에서 성공 아이콘 색상으로 사용 중 -> 이 부분은 뱃지와 무관한 용도이므로, 변수명을 `--color-success` 등으로 변경


### 7. 기타


**`reference/ddl.md:33`** - DDL 문서 업데이트
- `badges text[] not null default '{}'::text[]` -> `immediate boolean not null default false`

