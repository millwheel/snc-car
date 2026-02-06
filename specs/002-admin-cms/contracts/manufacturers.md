# API Contract: Manufacturers

**Feature**: 002-admin-cms

## GET (Client-side query)

제조사 목록은 클라이언트에서 Supabase 쿼리 빌더로 직접 조회한다 (읽기는 route.ts 불필요).

```typescript
const { data, error } = await supabase
  .from('manufacturers')
  .select('*')
  .order('sort_order', { ascending: true });
```

### Response Type

```typescript
ManufacturerRow[]
```

---

## POST /api/admin/manufacturers

새 제조사를 등록한다.

### Request

**Content-Type**: `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | 제조사 코드 (영문 소문자, 고유) |
| name | string | Yes | 제조사 이름 |
| category | string | Yes | 'DOMESTIC' 또는 'IMPORT' |
| sort_order | string (number) | Yes | 정렬 순서 |
| is_visible | string (boolean) | Yes | 노출 여부 |
| logo | File | No | 로고 이미지 파일 (SVG, PNG, JPG, WebP, max 5MB) |

### Success Response

**Status**: `201 Created`

```json
{
  "data": {
    "manufacturer_id": 1,
    "code": "hyundai",
    "name": "현대",
    "logo_path": "manufacturers/1/logo.svg",
    "category": "DOMESTIC",
    "sort_order": 1,
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
| 400 | 유효성 검증 실패 | `{ "error": "code is required" }` |
| 409 | 코드 중복 | `{ "error": "Manufacturer code already exists" }` |
| 500 | 서버 오류 | `{ "error": "Internal server error" }` |

### Processing Flow

1. 인증 검증 (`auth.getUser()`)
2. FormData 파싱 및 유효성 검증
3. 이미지 파일 존재 시 → Storage 업로드
4. DB insert (logo_path 포함)
5. DB 실패 시 → Storage에서 이미지 삭제 (보상 로직)
6. 성공 응답 반환

---

## PUT /api/admin/manufacturers/[id]

기존 제조사 정보를 수정한다.

### Request

**Content-Type**: `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | 제조사 코드 |
| name | string | Yes | 제조사 이름 |
| category | string | Yes | 'DOMESTIC' 또는 'IMPORT' |
| sort_order | string (number) | Yes | 정렬 순서 |
| is_visible | string (boolean) | Yes | 노출 여부 |
| logo | File | No | 새 로고 이미지 (변경 시에만) |

### Success Response

**Status**: `200 OK`

```json
{
  "data": { /* ManufacturerRow */ }
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 401 | 미인증 | `{ "error": "Unauthorized" }` |
| 400 | 유효성 검증 실패 | `{ "error": "..." }` |
| 404 | 존재하지 않는 ID | `{ "error": "Manufacturer not found" }` |
| 409 | 코드 중복 (다른 제조사) | `{ "error": "Manufacturer code already exists" }` |
| 500 | 서버 오류 | `{ "error": "Internal server error" }` |

### Processing Flow

1. 인증 검증
2. 기존 레코드 조회
3. FormData 파싱 및 유효성 검증
4. 새 이미지 존재 시 → Storage에 업로드 (기존 이미지 덮어쓰기)
5. DB update (updated_at 명시적 갱신)
6. DB 실패 시 → 새로 업로드한 이미지 삭제 (보상 로직)
7. 성공 응답 반환
