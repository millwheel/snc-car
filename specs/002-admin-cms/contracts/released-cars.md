# API Contract: Released Cars

**Feature**: 002-admin-cms

## GET (Client-side query)

출고차량 목록은 클라이언트에서 Supabase 쿼리 빌더로 직접 조회한다.

```typescript
const { data, error } = await supabase
  .from('released_cars')
  .select('*')
  .order('created_at', { ascending: false });
```

### Response Type

```typescript
ReleasedCarRow[]
```

---

## POST /api/admin/released-cars

새 출고차량을 등록한다.

### Request

**Content-Type**: `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| car_name | string | Yes | 차량명 |
| released_at | string (date) | Yes | 출고일 (YYYY-MM-DD) |
| is_visible | string (boolean) | Yes | 노출 여부 |
| thumbnail | File | No | 썸네일 이미지 (PNG, JPG, WebP, max 5MB) |

### Success Response

**Status**: `201 Created`

```json
{
  "data": {
    "released_car_id": 1,
    "car_name": "현대 그랜저",
    "thumbnail_path": "released-cars/1/thumb.png",
    "released_at": "2026-02-01",
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
| 400 | 유효성 검증 실패 | `{ "error": "car_name is required" }` |
| 400 | 잘못된 날짜 형식 | `{ "error": "Invalid date format" }` |
| 500 | 서버 오류 | `{ "error": "Internal server error" }` |

### Processing Flow

1. 인증 검증
2. FormData 파싱 및 유효성 검증
3. 이미지 존재 시 → Storage 업로드
4. DB insert
5. DB 실패 시 → Storage에서 이미지 삭제 (보상 로직)
6. 성공 응답 반환

---

## PUT /api/admin/released-cars/[id]

기존 출고차량 정보를 수정한다.

### Request

**Content-Type**: `multipart/form-data`

(POST와 동일한 필드)

### Success Response

**Status**: `200 OK`

```json
{
  "data": { /* ReleasedCarRow */ }
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 401 | 미인증 | `{ "error": "Unauthorized" }` |
| 400 | 유효성 검증 실패 | `{ "error": "..." }` |
| 404 | 존재하지 않는 ID | `{ "error": "Released car not found" }` |
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

## DELETE /api/admin/released-cars/[id]

출고차량을 삭제한다.

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
| 404 | 존재하지 않는 ID | `{ "error": "Released car not found" }` |
| 500 | 서버 오류 | `{ "error": "Internal server error" }` |

### Processing Flow

1. 인증 검증
2. 기존 레코드 조회 (thumbnail_path 확인)
3. DB delete
4. 성공 시 → thumbnail_path가 있으면 Storage에서 이미지 삭제
5. 성공 응답 반환
