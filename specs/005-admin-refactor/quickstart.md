# Quickstart: 관리자 페이지 리팩토링

**Feature**: 005-admin-refactor | **Date**: 2026-02-07

## Prerequisites

- Node.js 18+
- npm
- Supabase 프로젝트 (환경변수 설정 완료)

## Setup

```bash
# 1. 브랜치 전환
git checkout 005-admin-refactor

# 2. 의존성 설치
npm install

# 3. 환경변수 확인 (.env.local)
# SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...

# 4. DB 마이그레이션 (Supabase SQL Editor에서 실행)
ALTER TABLE manufacturers ADD COLUMN created_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE sale_cars ADD COLUMN created_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE released_cars ADD COLUMN created_by INT REFERENCES users(id) ON DELETE SET NULL;

# 5. 개발 서버 실행
npm run dev
```

## Key URLs

| URL | Description |
|-----|-------------|
| `/admin/login` | 관리자 로그인 |
| `/admin/manufacturers` | 제조사 목록 |
| `/admin/manufacturers/new` | 제조사 등록 |
| `/admin/manufacturers/[id]` | 제조사 상세 |
| `/admin/manufacturers/[id]/edit` | 제조사 수정 |
| `/admin/sale-cars` | 판매차량 목록 |
| `/admin/sale-cars/new` | 판매차량 등록 |
| `/admin/sale-cars/[id]` | 판매차량 상세 |
| `/admin/sale-cars/[id]/edit` | 판매차량 수정 |
| `/admin/released-cars` | 출고차량 목록 |
| `/admin/released-cars/new` | 출고차량 등록 |
| `/admin/released-cars/[id]` | 출고차량 상세 |
| `/admin/released-cars/[id]/edit` | 출고차량 수정 |

## Architecture Summary

### 변경 전 (현재)
- 단일 `/admin` 페이지에서 탭(AdminTabs)으로 제조사/판매차량/출고차량 전환
- 탭 내에서 list/create/edit 모드를 state로 전환
- 루트 레이아웃이 모든 페이지에 Header/Footer 렌더링

### 변경 후
- 각 관리 대상별 독립 페이지(URL 기반 라우팅)
- `ConditionalLayout`으로 admin 경로에서 Header/Footer 숨김
- `AdminHeader`로 관리자 전용 내비게이션 제공
- 목록 페이지에 서버 사이드 페이지네이션
- 상세 페이지 신규 추가 (수정/삭제 진입점)
- 메탈 계열 테마 색상 적용

## File Changes Overview

| Action | Files |
|--------|-------|
| 신규 | ConditionalLayout, AdminHeader, Pagination, 12개 페이지 파일 |
| 수정 | root layout.tsx, admin layout.tsx, admin page.tsx, 3개 API route, types/admin.ts |
| 제거 | AdminTabs, ManufacturerList, SaleCarList, ReleasedCarList (컴포넌트 → 페이지로 이동) |
| 유지 | ManufacturerForm, SaleCarForm, ReleasedCarForm, ImageUpload, DeleteConfirmModal |
