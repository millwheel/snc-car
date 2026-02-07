# API Contract: Manufacturers (제조사)

**Feature**: 005-admin-refactor | **Base Path**: `/api/admin/manufacturers`

## GET /api/admin/manufacturers

제조사 목록 조회 (페이지네이션 지원)

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
      "manufacturer_id": 1,
      "code": "hyundai",
      "name": "현대",
      "logo_path": "https://.../manufacturers/1/logo.svg",
      "category": "DOMESTIC",
      "sort_order": 1,
      "is_visible": true,
      "created_at": "2026-01-15T09:00:00Z",
      "updated_at": "2026-01-15T09:00:00Z",
      "created_by": 1,
      "users": { "nickname": "관리자1" }
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

**Auth**: Required (admin-session cookie)

---

## GET /api/admin/manufacturers/[id]

제조사 단일 조회 (상세 페이지용)

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | manufacturer_id |

**Response 200**:
```json
{
  "manufacturer_id": 1,
  "code": "hyundai",
  "name": "현대",
  "logo_path": "https://.../manufacturers/1/logo.svg",
  "category": "DOMESTIC",
  "sort_order": 1,
  "is_visible": true,
  "created_at": "2026-01-15T09:00:00Z",
  "updated_at": "2026-01-15T09:00:00Z",
  "created_by": 1,
  "users": { "nickname": "관리자1" }
}
```

**Response 404**:
```json
{ "error": "제조사를 찾을 수 없습니다" }
```

---

## POST /api/admin/manufacturers

제조사 신규 등록 (기존 유지 + created_by 자동 기록)

**Request**: `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | 제조사 코드 |
| name | string | Yes | 제조사 명 |
| category | string | Yes | 'DOMESTIC' \| 'IMPORT' |
| sort_order | number | Yes | 정렬 순서 |
| is_visible | string | No | 'true' \| 'false' |
| logo | File | No | 로고 이미지 |

**변경사항**: `created_by`를 현재 세션 사용자 ID로 자동 설정

**Response 201**: 생성된 제조사 데이터

---

## PUT /api/admin/manufacturers/[id]

제조사 수정 (기존 유지)

**Request**: `multipart/form-data` (POST와 동일 필드)

**Response 200**: 수정된 제조사 데이터
