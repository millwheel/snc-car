# API Contract: Released Cars (출고차량)

**Feature**: 005-admin-refactor | **Base Path**: `/api/admin/released-cars`

## GET /api/admin/released-cars

출고차량 목록 조회 (페이지네이션 지원)

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | 페이지 번호 (1-based) |
| limit | number | No | 10 | 페이지당 항목 수 |

**Response 200**:
```json
{
  "data": [
    {
      "released_car_id": 1,
      "car_name": "그랜저 IG 하이브리드",
      "thumbnail_path": "https://.../released-cars/1/thumb.webp",
      "released_at": "2026-01-25",
      "is_visible": true,
      "created_at": "2026-01-25T14:00:00Z",
      "updated_at": "2026-01-25T14:00:00Z",
      "created_by": 1,
      "users": { "nickname": "관리자1" }
    }
  ],
  "total": 18,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

**Auth**: Required (admin-session cookie)

---

## GET /api/admin/released-cars/[id]

출고차량 단일 조회 (상세 페이지용)

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | released_car_id |

**Response 200**:
```json
{
  "released_car_id": 1,
  "car_name": "그랜저 IG 하이브리드",
  "thumbnail_path": "https://.../released-cars/1/thumb.webp",
  "released_at": "2026-01-25",
  "is_visible": true,
  "created_at": "2026-01-25T14:00:00Z",
  "updated_at": "2026-01-25T14:00:00Z",
  "created_by": 1,
  "users": { "nickname": "관리자1" }
}
```

**Response 404**:
```json
{ "error": "출고차량을 찾을 수 없습니다" }
```

---

## POST /api/admin/released-cars

출고차량 신규 등록 (기존 유지 + created_by 자동 기록)

**Request**: `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| car_name | string | Yes | 차량명 |
| released_at | string | Yes | 출고일 (YYYY-MM-DD) |
| is_visible | string | No | 'true' \| 'false' |
| thumbnail | File | No | 썸네일 이미지 |

**변경사항**: `created_by`를 현재 세션 사용자 ID로 자동 설정

**Response 201**: 생성된 출고차량 데이터

---

## PUT /api/admin/released-cars/[id]

출고차량 수정 (기존 유지)

**Request**: `multipart/form-data` (POST와 동일 필드)

**Response 200**: 수정된 출고차량 데이터

---

## DELETE /api/admin/released-cars/[id]

출고차량 삭제 (기존 유지)

**Response 200**:
```json
{ "success": true }
```
