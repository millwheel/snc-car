# Data Model: 관리자 페이지 리팩토링

**Feature**: 005-admin-refactor | **Date**: 2026-02-07

> 기존 DB 테이블(002-admin-cms에서 정의)을 유지하면서 `created_by` 컬럼만 추가. 이 문서는 변경 사항과 신규 타입을 문서화한다.

## Schema Changes

### 컬럼 추가: `created_by`

각 관리 대상 테이블에 작성자 추적을 위한 컬럼 추가.

**대상 테이블**: `manufacturers`, `sale_cars`, `released_cars`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| created_by | INT | FK → users(id), NULLABLE | 데이터를 생성한 관리자 ID |

**마이그레이션 SQL**:
```sql
ALTER TABLE manufacturers ADD COLUMN created_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE sale_cars ADD COLUMN created_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE released_cars ADD COLUMN created_by INT REFERENCES users(id) ON DELETE SET NULL;
```

**Notes**:
- NULLABLE: 기존 데이터에는 작성자 정보가 없으므로 NULL 허용
- ON DELETE SET NULL: 관리자 계정 삭제 시 작성자 정보를 NULL로 변경 (데이터 보존)
- 신규 등록 시 현재 세션 사용자의 `id`를 자동 기록

## Entities (기존 유지)

> 002-admin-cms의 data-model.md 참조. 아래는 변경/추가된 부분만 기술.

### Manufacturer (제조사) - 변경사항

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| created_by | INT | FK → users(id), NULLABLE | 작성자 (추가) |

### SaleCar (판매차량) - 변경사항

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| created_by | INT | FK → users(id), NULLABLE | 작성자 (추가) |

### ReleasedCar (출고차량) - 변경사항

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| created_by | INT | FK → users(id), NULLABLE | 작성자 (추가) |

### User (관리자) - 변경 없음

기존 스키마 유지:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, auto increment | 사용자 고유 식별자 |
| username | text | UNIQUE, NOT NULL | 로그인 ID |
| password | text | NOT NULL | bcrypt 해시된 비밀번호 |
| nickname | text | NOT NULL | 표시 닉네임 (목록에서 작성자로 표시) |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 생성일시 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 수정일시 |

## Relationships

```text
users (1) ────< (N) manufacturers   (created_by FK)
users (1) ────< (N) sale_cars       (created_by FK)
users (1) ────< (N) released_cars   (created_by FK)

manufacturers (1) ────< (N) sale_cars   (manufacturer_id FK, 기존)
released_cars (독립 엔티티)
```

## TypeScript Types (추가/변경)

```typescript
// types/admin.ts 에 추가

// 기존 Row 타입에 created_by 추가
export interface ManufacturerRow {
  // ... 기존 필드 유지
  created_by: number | null;  // 추가
}

export interface SaleCarRow {
  // ... 기존 필드 유지
  created_by: number | null;  // 추가
}

export interface ReleasedCarRow {
  // ... 기존 필드 유지
  created_by: number | null;  // 추가
}

// 목록 조회용 JOIN 타입
export interface ManufacturerWithAuthor extends ManufacturerRow {
  users: { nickname: string } | null;
}

export interface SaleCarWithAuthor extends SaleCarRow {
  manufacturers: { name: string } | null;
  users: { nickname: string } | null;
}

export interface ReleasedCarWithAuthor extends ReleasedCarRow {
  users: { nickname: string } | null;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Storage Paths (변경 없음)

기존 002-admin-cms의 Storage 경로 패턴 유지.

| Entity | Path Pattern | Example |
|--------|-------------|---------|
| Manufacturer logo | `manufacturers/{id}/logo.{ext}` | `manufacturers/3/logo.svg` |
| SaleCar thumbnail | `sale-cars/{id}/thumb.{ext}` | `sale-cars/15/thumb.webp` |
| ReleasedCar thumbnail | `released-cars/{id}/thumb.{ext}` | `released-cars/7/thumb.png` |
