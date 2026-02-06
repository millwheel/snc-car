# API Contract: Sale Cars

**Feature**: 002-admin-cms

## GET (Client-side query)

판매차량 목록은 클라이언트에서 Supabase 쿼리 빌더로 직접 조회한다.

```typescript
const { data, error } = await supabase
  .from('sale_cars')
  .select('*, manufacturers(name)')
  .order('created_at', { ascending: false });
```

### Response Type

```typescript
(SaleCarRow & { manufacturers: { name: string } })[]
```

---

## POST /api/admin/sale-cars

새 판매차량을 등록한다.

### Request

**Content-Type**: `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| manufacturer_id | string (number) | Yes | 제조사 ID |
| name | string | Yes | 차량명 |
| description | string | No | 차량 설명 |
| rent_price | string (number) | No | 렌트 가격 (빈 문자열 = null) |
| lease_price | string (number) | No | 리스 가격 (빈 문자열 = null) |
| badges | string (JSON array) | No | 배지 목록 (e.g., '["즉시출고","프로모션"]') |
| is_visible | string (boolean) | Yes | 노출 여부 |
| thumbnail | File | No | 썸네일 이미지 (WebP, PNG, JPG, max 5MB) |

### Success Response

**Status**: `201 Created`

```json
{
  "data": {
    "sale_car_id": 1,
    "manufacturer_id": 3,
    "name": "아반떼 CN7",
    "description": "...",
    "thumbnail_path": "sale-cars/1/thumb.webp",
    "rent_price": 350000,
    "lease_price": 300000,
    "badges": ["즉시출고"],
    "is_visible": true,
    "created_at": "2026-02-06T00:00:00Z",
    "updated_at": "2026-02-06T00:00:00Z"
  }
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 401 | 미인증 | `{ "error": "Unauthorized" }` |
| 400 | 유효성 검증 실패 | `{ "error": "manufacturer_id is required" }` |
| 400 | 존재하지 않는 제조사 | `{ "error": "Manufacturer not found" }` |
| 500 | 서버 오류 | `{ "error": "Internal server error" }` |

### Processing Flow

1. 인증 검증
2. FormData 파싱 및 유효성 검증
3. manufacturer_id로 제조사 존재 여부 확인
4. 이미지 존재 시 → Storage 업로드
5. DB insert
6. DB 실패 시 → Storage에서 이미지 삭제 (보상 로직)
7. 성공 응답 반환

---

## PUT /api/admin/sale-cars/[id]

기존 판매차량 정보를 수정한다.

### Request

**Content-Type**: `multipart/form-data`

(POST와 동일한 필드)

### Success Response

**Status**: `200 OK`

```json
{
  "data": { /* SaleCarRow */ }
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 401 | 미인증 | `{ "error": "Unauthorized" }` |
| 400 | 유효성 검증 실패 | `{ "error": "..." }` |
| 404 | 존재하지 않는 ID | `{ "error": "Sale car not found" }` |
| 500 | 서버 오류 | `{ "error": "Internal server error" }` |

### Processing Flow

1. 인증 검증
2. 기존 레코드 조회
3. FormData 파싱 및 유효성 검증
4. 새 이미지 존재 시 → Storage에 업로드 (기존 덮어쓰기)
5. DB update (updated_at 명시적 갱신)
6. DB 실패 시 → 보상 로직
7. 성공 응답 반환

---

## DELETE /api/admin/sale-cars/[id]

판매차량을 삭제한다.

### Request

Body 없음. URL 파라미터의 `id`로 식별.

### Success Response

**Status**: `200 OK`

```json
{
  "message": "Deleted successfully"
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 401 | 미인증 | `{ "error": "Unauthorized" }` |
| 404 | 존재하지 않는 ID | `{ "error": "Sale car not found" }` |
| 500 | 서버 오류 | `{ "error": "Internal server error" }` |

### Processing Flow

1. 인증 검증
2. 기존 레코드 조회 (thumbnail_path 확인)
3. DB delete
4. 성공 시 → thumbnail_path가 있으면 Storage에서 이미지 삭제
5. 성공 응답 반환
