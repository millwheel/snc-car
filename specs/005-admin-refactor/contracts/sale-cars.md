# API Contract: Sale Cars (판매차량)

**Feature**: 005-admin-refactor | **Base Path**: `/api/admin/sale-cars`

## GET /api/admin/sale-cars

판매차량 목록 조회 (페이지네이션 지원)

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
      "sale_car_id": 1,
      "manufacturer_id": 1,
      "name": "아반떼 CN7",
      "description": "...",
      "thumbnail_path": "https://.../sale-cars/1/thumb.webp",
      "rent_price": 350000,
      "lease_price": 320000,
      "badges": ["즉시출고"],
      "is_visible": true,
      "created_at": "2026-01-20T10:00:00Z",
      "updated_at": "2026-01-20T10:00:00Z",
      "created_by": 1,
      "manufacturers": { "name": "현대" },
      "users": { "nickname": "관리자1" }
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

**Auth**: Required (admin-session cookie)

---

## GET /api/admin/sale-cars/[id]

판매차량 단일 조회 (상세 페이지용)

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | sale_car_id |

**Response 200**:
```json
{
  "sale_car_id": 1,
  "manufacturer_id": 1,
  "name": "아반떼 CN7",
  "description": "...",
  "thumbnail_path": "https://.../sale-cars/1/thumb.webp",
  "rent_price": 350000,
  "lease_price": 320000,
  "badges": ["즉시출고"],
  "is_visible": true,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:00:00Z",
  "created_by": 1,
  "manufacturers": { "name": "현대" },
  "users": { "nickname": "관리자1" }
}
```

**Response 404**:
```json
{ "error": "판매차량을 찾을 수 없습니다" }
```

---

## POST /api/admin/sale-cars

판매차량 신규 등록 (기존 유지 + created_by 자동 기록)

**Request**: `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| manufacturer_id | number | Yes | 제조사 ID |
| name | string | Yes | 차량명 |
| description | string | No | 차량 설명 |
| rent_price | number | No | 렌트 가격 |
| lease_price | number | No | 리스 가격 |
| badges | string (JSON) | No | 배지 배열 JSON |
| is_visible | string | No | 'true' \| 'false' |
| thumbnail | File | No | 썸네일 이미지 |

**변경사항**: `created_by`를 현재 세션 사용자 ID로 자동 설정

**Response 201**: 생성된 판매차량 데이터

---

## PUT /api/admin/sale-cars/[id]

판매차량 수정 (기존 유지)

**Request**: `multipart/form-data` (POST와 동일 필드)

**Response 200**: 수정된 판매차량 데이터

---

## DELETE /api/admin/sale-cars/[id]

판매차량 삭제 (기존 유지)

**Response 200**:
```json
{ "success": true }
```
