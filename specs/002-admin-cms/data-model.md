# Data Model: Admin CMS 관리 페이지

**Feature**: 002-admin-cms | **Date**: 2026-02-06

> DB 테이블은 이미 Supabase에 생성되어 있음. 이 문서는 타입 정의와 관계를 문서화한다.

## Entities

### Manufacturer (제조사)

**Table**: `manufacturers`
**Sort**: `sort_order ASC`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| manufacturer_id | BIGINT | PK, auto increment | 제조사 고유 식별자 |
| code | text | UNIQUE, NOT NULL | 제조사 코드 (e.g., 'hyundai', 'bmw') |
| name | text | NOT NULL | 제조사 한글명 (e.g., '현대', 'BMW') |
| logo_path | text | | Storage 내 로고 이미지 경로 |
| category | text | NOT NULL | 'DOMESTIC' 또는 'IMPORT' |
| sort_order | int | NOT NULL | 표시 정렬 순서 |
| is_visible | boolean | NOT NULL, DEFAULT true | 노출 여부 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 생성일시 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 수정일시 |

**Validation rules** (route.ts에서 수행):
- `code`: 필수, 영문 소문자+하이픈, 고유성 검증
- `name`: 필수, 최소 1자
- `category`: 'DOMESTIC' 또는 'IMPORT'만 허용
- `sort_order`: 0 이상 정수
- `logo_path`: 이미지 업로드 시 자동 설정

**Operations**: 등록(POST), 수정(PUT) — 삭제 불가

---

### SaleCar (판매차량)

**Table**: `sale_cars`
**Sort**: `created_at DESC`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| sale_car_id | BIGINT | PK, auto increment | 판매차량 고유 식별자 |
| manufacturer_id | BIGINT | FK → manufacturers, ON DELETE RESTRICT | 제조사 참조 |
| name | text | NOT NULL | 차량명 |
| description | text | | 차량 설명 |
| thumbnail_path | text | | Storage 내 썸네일 이미지 경로 |
| rent_price | int | nullable | 렌트 가격 (null = 비용문의) |
| lease_price | int | nullable | 리스 가격 (null = 비용문의) |
| badges | text[] | DEFAULT '{}' | 배지 목록 (e.g., '즉시출고', '프로모션') |
| is_visible | boolean | NOT NULL, DEFAULT true | 노출 여부 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 생성일시 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 수정일시 |

**Validation rules** (route.ts에서 수행):
- `manufacturer_id`: 필수, manufacturers 테이블에 존재하는 ID
- `name`: 필수, 최소 1자
- `rent_price`, `lease_price`: null 또는 0 이상 정수
- `badges`: 문자열 배열

**Operations**: 등록(POST), 수정(PUT), 삭제(DELETE)

---

### ReleasedCar (출고차량)

**Table**: `released_cars`
**Sort**: `created_at DESC`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| released_car_id | BIGINT | PK, auto increment | 출고차량 고유 식별자 |
| car_name | text | NOT NULL | 차량명 |
| thumbnail_path | text | | Storage 내 썸네일 이미지 경로 |
| released_at | date | NOT NULL | 출고일 |
| is_visible | boolean | NOT NULL, DEFAULT true | 노출 여부 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 생성일시 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 수정일시 |

**Validation rules** (route.ts에서 수행):
- `car_name`: 필수, 최소 1자
- `released_at`: 필수, 유효한 날짜 형식 (YYYY-MM-DD)

**Operations**: 등록(POST), 수정(PUT), 삭제(DELETE)

## Relationships

```text
manufacturers (1) ──────< (N) sale_cars
    │                         │
    │ manufacturer_id         │ manufacturer_id (FK)
    │                         │ ON DELETE RESTRICT
    └─────────────────────────┘

released_cars (독립 엔티티, 외래키 없음)
```

- Manufacturer → SaleCar: 1:N 관계 (한 제조사가 여러 판매차량 보유)
- ON DELETE RESTRICT: 판매차량이 참조하는 제조사는 삭제 불가 (UI에서도 삭제 버튼 미제공)
- ReleasedCar: 독립 엔티티, 다른 테이블과 관계 없음

## Storage Paths

| Entity | Path Pattern | Example |
|--------|-------------|---------|
| Manufacturer logo | `manufacturers/{id}/logo.{ext}` | `manufacturers/3/logo.svg` |
| SaleCar thumbnail | `sale-cars/{id}/thumb.{ext}` | `sale-cars/15/thumb.webp` |
| ReleasedCar thumbnail | `released-cars/{id}/thumb.{ext}` | `released-cars/7/thumb.png` |

**Note**: 신규 등록(POST) 시에는 DB ID가 없으므로, UUID 기반 임시 경로를 사용하거나 DB insert 후 이미지를 업로드하는 방식 적용. 자세한 내용은 research.md R7 참조.

## TypeScript Types (Admin DB Types)

```typescript
// types/admin.ts

interface ManufacturerRow {
  manufacturer_id: number;
  code: string;
  name: string;
  logo_path: string | null;
  category: 'DOMESTIC' | 'IMPORT';
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface SaleCarRow {
  sale_car_id: number;
  manufacturer_id: number;
  name: string;
  description: string | null;
  thumbnail_path: string | null;
  rent_price: number | null;
  lease_price: number | null;
  badges: string[];
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface ReleasedCarRow {
  released_car_id: number;
  car_name: string;
  thumbnail_path: string | null;
  released_at: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}
```
