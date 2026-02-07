# Implementation Plan: 관리자 페이지 리팩토링

**Branch**: `005-admin-refactor` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-admin-refactor/spec.md`

## Summary

현재 단일 페이지 탭 기반 관리자 대시보드를 제조사/판매차량/출고차량 별도 페이지(목록·상세·등록·수정)로 분리하고, 관리자 전용 헤더를 도입하며, 메인 사이트 헤더/푸터를 관리자 영역에서 숨기고, 메탈 계열 색상 테마를 적용하는 리팩토링.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x, Next.js 16.x (App Router)
**Primary Dependencies**: `@supabase/supabase-js` ^2.95.3, `bcryptjs` ^3.0.3, TailwindCSS v4
**Storage**: Supabase Postgres (DB) + Supabase Storage (`public-media` bucket)
**Testing**: 수동 브라우저 테스트 (기존 테스트 프레임워크 미설정)
**Target Platform**: Web (데스크톱 우선, 반응형)
**Project Type**: Web (Next.js 풀스택)
**Performance Goals**: 페이지 로딩 2초 이내, 페이지네이션 응답 1초 이내
**Constraints**: 기존 API 엔드포인트 호환, 기존 DB 스키마 최소 변경
**Scale/Scope**: 관리자 1~3명, 데이터 수백 건 수준

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution이 기본 템플릿 상태(프로젝트 고유 원칙 미설정)이므로, 일반적인 소프트웨어 품질 원칙 적용:
- **단순성**: 기존 코드 패턴(FormData, Supabase 직접 호출)을 유지하며 불필요한 추상화 지양 → PASS
- **테스트 가능성**: 각 페이지가 독립 URL을 가져 개별 테스트 가능 → PASS
- **관심사 분리**: 관리자 레이아웃/헤더를 메인 사이트로부터 분리 → PASS

## Project Structure

### Documentation (this feature)

```text
specs/005-admin-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── manufacturers.md
│   ├── sale-cars.md
│   └── released-cars.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                          # 수정: ConditionalLayout으로 Header/Footer 조건부 렌더링
│   ├── globals.css                         # 유지: 기존 metallic 색상 변수 활용
│   └── admin/
│       ├── layout.tsx                      # 수정: AdminHeader 추가
│       ├── page.tsx                        # 수정: /admin/manufacturers로 redirect
│       ├── login/page.tsx                  # 유지: 기존 로그인 페이지
│       ├── manufacturers/
│       │   ├── page.tsx                    # 신규: 제조사 목록
│       │   ├── new/page.tsx                # 신규: 제조사 등록
│       │   └── [id]/
│       │       ├── page.tsx                # 신규: 제조사 상세
│       │       └── edit/page.tsx           # 신규: 제조사 수정
│       ├── sale-cars/
│       │   ├── page.tsx                    # 신규: 판매차량 목록
│       │   ├── new/page.tsx                # 신규: 판매차량 등록
│       │   └── [id]/
│       │       ├── page.tsx                # 신규: 판매차량 상세
│       │       └── edit/page.tsx           # 신규: 판매차량 수정
│       └── released-cars/
│           ├── page.tsx                    # 신규: 출고차량 목록
│           ├── new/page.tsx                # 신규: 출고차량 등록
│           └── [id]/
│               ├── page.tsx                # 신규: 출고차량 상세
│               └── edit/page.tsx           # 신규: 출고차량 수정
├── components/
│   ├── layout/
│   │   ├── Header.tsx                      # 유지
│   │   ├── Footer.tsx                      # 유지
│   │   └── ConditionalLayout.tsx           # 신규: /admin 경로에서 Header/Footer 숨김
│   └── admin/
│       ├── AdminHeader.tsx                 # 신규: 관리자 전용 헤더 (로고, 내비, 로그아웃)
│       ├── Pagination.tsx                  # 신규: 페이지네이션 컴포넌트
│       ├── ManufacturerForm.tsx            # 유지: 등록/수정 폼
│       ├── SaleCarForm.tsx                 # 유지: 등록/수정 폼
│       ├── ReleasedCarForm.tsx             # 유지: 등록/수정 폼
│       ├── ImageUpload.tsx                 # 유지
│       ├── DeleteConfirmModal.tsx          # 유지
│       ├── AdminTabs.tsx                   # 제거: AdminHeader로 대체
│       ├── ManufacturerList.tsx            # 제거: 페이지로 이동
│       ├── SaleCarList.tsx                 # 제거: 페이지로 이동
│       └── ReleasedCarList.tsx             # 제거: 페이지로 이동
├── app/api/admin/
│   ├── manufacturers/
│   │   ├── route.ts                        # 수정: GET에 pagination, created_by JOIN 추가
│   │   └── [id]/route.ts                   # 수정: GET(단일 조회) 추가
│   ├── sale-cars/
│   │   ├── route.ts                        # 수정: GET에 pagination, created_by JOIN 추가
│   │   └── [id]/route.ts                   # 수정: GET(단일 조회) 추가
│   └── released-cars/
│       ├── route.ts                        # 수정: GET에 pagination, created_by JOIN 추가
│       └── [id]/route.ts                   # 수정: GET(단일 조회) 추가
└── types/
    └── admin.ts                            # 수정: created_by, 페이지네이션 타입 추가
```

**Structure Decision**: 기존 Next.js App Router 구조를 유지하면서, 관리자 영역 내에 RESTful 라우트 패턴으로 페이지를 추가. 목록 로직은 컴포넌트에서 페이지로 이동하고, 공유 컴포넌트(폼, 모달, 이미지 업로드)는 유지.

## Complexity Tracking

> 복잡도 위반 사항 없음. 기존 패턴을 유지하며 구조적 분리만 수행.
