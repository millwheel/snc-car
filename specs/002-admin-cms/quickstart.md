# Quickstart: Admin CMS 관리 페이지

**Feature**: 002-admin-cms | **Date**: 2026-02-06

## Prerequisites

- Node.js 18+ 설치
- Supabase 프로젝트 생성 완료
- `.env` 파일에 다음 환경변수 설정:
  ```
  NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
  SUPABASE_STORAGE_BUCKET=public-media
  ```
- Supabase에 다음이 준비되어 있어야 함:
  - DB 테이블: `manufacturers`, `sale_cars`, `released_cars`
  - Storage bucket: `public-media` (public)
  - Auth에 관리자 계정 등록 (email/password)

## Setup

```bash
# 1. 의존성 설치
npm install @supabase/ssr

# 2. 개발 서버 실행
npm run dev

# 3. Admin 페이지 접근
# 브라우저에서 http://localhost:3000/admin/login 접속
```

## Key URLs

| Page | URL | Description |
|------|-----|-------------|
| Admin 로그인 | `/admin/login` | 이메일/비밀번호 로그인 |
| Admin 대시보드 | `/admin` | 3개 탭 (제조사/판매차량/출고차량) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/manufacturers` | 제조사 등록 |
| PUT | `/api/admin/manufacturers/{id}` | 제조사 수정 |
| POST | `/api/admin/sale-cars` | 판매차량 등록 |
| PUT | `/api/admin/sale-cars/{id}` | 판매차량 수정 |
| DELETE | `/api/admin/sale-cars/{id}` | 판매차량 삭제 |
| POST | `/api/admin/released-cars` | 출고차량 등록 |
| PUT | `/api/admin/released-cars/{id}` | 출고차량 수정 |
| DELETE | `/api/admin/released-cars/{id}` | 출고차량 삭제 |

## Architecture Overview

```
[Browser] ──── Client Component (blob) ──── multipart/form-data ────→ [Route Handler]
                                                                          │
                                                    ┌─────────────────────┤
                                                    ▼                     ▼
                                            [Supabase Storage]    [Supabase Postgres]
                                            (이미지 업로드)       (데이터 저장)
                                                    │                     │
                                                    │   실패 시 보상 로직   │
                                                    ◄─────────────────────┘
```

## Key Design Principles

1. **route.ts에서만 쓰기**: 모든 DB/Storage 쓰기는 Route Handler에서 처리
2. **이미지 → DB 순서**: Storage 업로드 성공 후 DB insert, 실패 시 Storage 롤백
3. **임시 업로드 없음**: 클라이언트에서 blob 유지, 저장 시 multipart 전송
4. **@supabase/ssr만 사용**: @supabase/supabase-js 직접 사용 금지
5. **ORM 사용 금지**: Supabase 쿼리 빌더 직접 사용
