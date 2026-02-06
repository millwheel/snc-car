# Implementation Plan: Admin CMS 관리 페이지

**Branch**: `002-admin-cms` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-admin-cms/spec.md`

## Summary

S&C 신차 장기 렌트/리스 서비스의 Admin CMS 페이지를 구현한다. 기존 Next.js 16 (App Router) + TailwindCSS v4 프로젝트에 Supabase 연동을 추가하여, 제조사·판매차량·출고차량의 CRUD 관리 기능과 이미지 업로드를 제공한다. `@supabase/ssr` 패키지를 사용하고, 모든 쓰기 작업은 Route Handler(route.ts)에서 처리하며, 이미지 → DB 순서와 보상 로직을 엄격히 준수한다.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x, Next.js 16.x (App Router)
**Primary Dependencies**: `@supabase/ssr` (Supabase 클라이언트), TailwindCSS v4
**Storage**: Supabase Postgres (DB) + Supabase Storage (이미지, public bucket: `public-media`)
**Testing**: 수동 테스트 (기존 프로젝트에 테스트 프레임워크 미설정)
**Target Platform**: Web (브라우저)
**Project Type**: Web application (Next.js App Router, 단일 프로젝트)
**Performance Goals**: CRUD 응답 3초 이내
**Constraints**: `@supabase/supabase-js` 직접 사용 금지, ORM 사용 금지, DB enum/trigger/index 사용 금지, 메인 페이지 변경 금지
**Scale/Scope**: 단일 관리자, 3개 엔티티(제조사/판매차량/출고차량), 8개 API 엔드포인트

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution은 프로젝트별 커스터마이즈 전 상태(템플릿)이므로 특정 위반 사항 없음.
다만 admin-task.md에 명시된 설계 원칙을 Constitution으로 간주하여 검증:

| 원칙 | 상태 | 비고 |
|------|------|------|
| route.ts에서만 쓰기 작업 | PASS | 모든 POST/PUT/DELETE는 route.ts에서 처리 |
| 이미지 → DB 순서 + 보상 로직 | PASS | 설계에 반영 |
| 임시 업로드 없음 (blob → multipart) | PASS | 클라이언트에서 blob 유지, 저장 시 multipart 전송 |
| DB는 저장소만 (enum/trigger/index 없음) | PASS | 모든 검증 로직은 route.ts에서 수행 |
| 단일 관리자 (role 없음) | PASS | auth.getUser()로 로그인 여부만 확인 |
| 정렬 정책 준수 | PASS | manufacturers: sort_order ASC, others: created_at DESC |
| 대표 이미지 1장만 | PASS | thumbnail 단일 필드 |
| @supabase/ssr만 사용 | PASS | @supabase/supabase-js 직접 사용 안 함 |
| ORM 사용 금지 | PASS | Supabase 클라이언트 쿼리 빌더 직접 사용 |

**Result**: All gates PASS

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-cms/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── manufacturers.md
│   ├── sale-cars.md
│   ├── released-cars.md
│   └── auth.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              # Admin 레이아웃 (인증 체크, 탭 네비게이션)
│   │   ├── page.tsx                # Admin 대시보드 (탭 전환 관리)
│   │   └── login/
│   │       └── page.tsx            # 로그인 페이지
│   ├── api/
│   │   └── admin/
│   │       ├── manufacturers/
│   │       │   ├── route.ts        # POST (등록)
│   │       │   └── [id]/
│   │       │       └── route.ts    # PUT (수정)
│   │       ├── sale-cars/
│   │       │   ├── route.ts        # POST (등록)
│   │       │   └── [id]/
│   │       │       └── route.ts    # PUT (수정), DELETE (삭제)
│   │       └── released-cars/
│   │           ├── route.ts        # POST (등록)
│   │           └── [id]/
│   │               └── route.ts    # PUT (수정), DELETE (삭제)
│   ├── layout.tsx                  # 기존 루트 레이아웃 (변경 없음)
│   ├── page.tsx                    # 기존 메인 페이지 (변경 없음)
│   └── globals.css                 # 기존 (변경 없음)
├── components/
│   ├── admin/
│   │   ├── AdminTabs.tsx           # 탭 네비게이션 컴포넌트
│   │   ├── ManufacturerForm.tsx    # 제조사 등록/수정 폼
│   │   ├── ManufacturerList.tsx    # 제조사 목록
│   │   ├── SaleCarForm.tsx         # 판매차량 등록/수정 폼
│   │   ├── SaleCarList.tsx         # 판매차량 목록
│   │   ├── ReleasedCarForm.tsx     # 출고차량 등록/수정 폼
│   │   ├── ReleasedCarList.tsx     # 출고차량 목록
│   │   ├── ImageUpload.tsx         # 공통 이미지 업로드 컴포넌트
│   │   ├── DeleteConfirmModal.tsx  # 삭제 확인 모달
│   │   └── LoginForm.tsx           # 로그인 폼
│   └── ...                         # 기존 컴포넌트 (변경 없음)
├── lib/
│   └── supabase/
│       ├── client.ts               # 브라우저용 Supabase 클라이언트
│       ├── server.ts               # 서버용 Supabase 클라이언트
│       └── middleware.ts           # Supabase 미들웨어 헬퍼
├── types/
│   ├── admin.ts                    # Admin 관련 DB 타입 (snake_case)
│   └── ...                         # 기존 타입 (변경 없음)
└── middleware.ts                    # Next.js 미들웨어 (admin 경로 인증 체크)
```

**Structure Decision**: 기존 Next.js App Router 프로젝트 구조를 유지하면서, `src/app/admin/` 하위에 Admin 페이지를, `src/app/api/admin/` 하위에 API Route Handler를 추가한다. Supabase 클라이언트는 `src/lib/supabase/`에 배치한다. 기존 메인 페이지 코드는 일체 변경하지 않는다.

## Complexity Tracking

> No constitution violations to justify.
