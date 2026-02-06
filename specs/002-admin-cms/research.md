# Research: Admin CMS 관리 페이지

**Feature**: 002-admin-cms | **Date**: 2026-02-06

## R1: Supabase SSR 클라이언트 구성 (@supabase/ssr)

**Decision**: `@supabase/ssr` 패키지를 사용하여 browser/server 두 종류의 클라이언트를 생성한다.

**Rationale**: admin-task.md에서 `@supabase/ssr`만 사용하도록 명시되어 있으며, `@supabase/supabase-js` 직접 사용은 금지되어 있다. `@supabase/ssr`은 내부적으로 `@supabase/supabase-js`를 의존성으로 포함하므로 기능적 제약 없이 SSR 환경에 최적화된 쿠키 기반 세션 관리를 제공한다.

**Alternatives considered**:
- `@supabase/supabase-js` 직접 사용: admin-task.md에서 명시적으로 금지
- `@supabase/auth-helpers-nextjs`: deprecated, `@supabase/ssr`로 대체됨

**Implementation approach**:
- `createBrowserClient()`: 클라이언트 컴포넌트에서 사용
- `createServerClient()`: Route Handler, Server Component, Middleware에서 사용
- 쿠키 관리는 Next.js `cookies()` API 활용

---

## R2: Next.js Middleware를 통한 인증 보호

**Decision**: `src/middleware.ts`에서 `/admin` 경로(로그인 페이지 제외)에 대한 인증 체크를 수행하고, 미인증 시 `/admin/login`으로 리다이렉트한다.

**Rationale**: Next.js Middleware는 모든 라우트 요청 전에 실행되므로, 페이지 로드 시점에서 인증을 검증할 수 있다. 이는 클라이언트 사이드에서 체크하는 것보다 보안적으로 우수하며, 미인증 사용자에게 Admin UI가 노출되는 것을 원천적으로 방지한다.

**Alternatives considered**:
- Admin layout에서만 인증 체크: 페이지가 일시적으로 노출될 수 있음 (flash)
- Server Component에서 redirect(): Middleware보다 늦게 실행됨

**Implementation approach**:
- `matcher: ['/admin/:path*']` 설정 (API 라우트 제외 가능하지만 API에서도 별도 검증)
- `/admin/login` 경로는 미인증 허용
- Supabase의 `getUser()`로 세션 유효성 검증
- Route Handler에서도 `auth.getUser()`로 이중 검증

---

## R3: Route Handler에서 multipart/form-data 처리

**Decision**: Next.js Route Handler에서 `request.formData()`를 사용하여 multipart/form-data를 직접 파싱한다.

**Rationale**: Next.js App Router의 Route Handler는 Web API 표준 `Request.formData()`를 네이티브로 지원한다. 별도 라이브러리(multer, formidable 등) 없이 파일 업로드를 처리할 수 있다.

**Alternatives considered**:
- multer / formidable: App Router에서 사용이 복잡하며 불필요한 의존성 추가
- Server Action: admin-task.md에서 route.ts 사용을 명시

**Implementation approach**:
```
const formData = await request.formData();
const file = formData.get('image') as File;
const name = formData.get('name') as string;
```

---

## R4: 이미지 업로드 → DB 저장 → 보상 로직 패턴

**Decision**: 이미지를 먼저 Storage에 업로드하고, DB insert를 시도한 후, 실패 시 Storage에서 이미지를 삭제하는 보상 로직을 적용한다.

**Rationale**: admin-task.md의 핵심 설계 원칙 #2에 명시된 순서이다. 이미지 업로드가 성공한 후 DB 작업을 수행하고, DB 실패 시 업로드된 이미지를 정리하여 고아 파일을 방지한다.

**Alternatives considered**:
- DB 먼저 → 이미지 업로드: 이미지 없이 DB 레코드가 생성될 위험
- 트랜잭션 기반: Supabase Storage와 DB가 별도 시스템이므로 단일 트랜잭션 불가

**Implementation pattern**:
```
1. 파일 검증 (크기, 형식)
2. Storage에 이미지 업로드
3. DB에 레코드 insert/update (image path 포함)
4. 성공 → 응답 반환
5. DB 실패 → Storage에서 이미지 삭제 후 에러 응답
```

---

## R5: 기존 타입과 Admin 타입 분리

**Decision**: DB 스키마와 매핑되는 Admin 전용 타입을 `types/admin.ts`에 snake_case로 정의하고, 기존 camelCase 타입은 변경하지 않는다.

**Rationale**: 기존 프론트엔드 타입(`types/manufacturer.ts` 등)은 camelCase이며 mock 데이터와 매핑된다. DB 테이블은 snake_case이므로 Admin 타입을 별도로 정의하여 혼란을 방지한다. 향후 메인 페이지가 DB에 연결될 때 매핑 레이어를 추가할 수 있다.

**Alternatives considered**:
- 기존 타입을 snake_case로 변경: 메인 페이지 코드 변경이 필요하여 범위 초과
- camelCase 변환 유틸리티: 과도한 복잡성 추가

---

## R6: Admin 대시보드 탭 UI 구현 방식

**Decision**: 클라이언트 상태(`useState`)로 탭을 전환하는 단일 페이지 방식을 사용한다.

**Rationale**: Admin 페이지는 `/admin` 단일 경로에 3개 탭으로 구성된다. URL 라우팅 기반 탭 전환보다 클라이언트 상태 기반이 간단하며, admin-task.md의 `/admin` 페이지 구조와 일치한다.

**Alternatives considered**:
- 각 탭을 별도 라우트(`/admin/manufacturers`, `/admin/sale-cars`)로 분리: admin-task.md 명세와 불일치
- URL search params 기반 탭: 불필요한 복잡성

---

## R7: Storage 경로 규칙 및 파일명

**Decision**: admin-task.md에 명시된 경로 규칙을 그대로 따른다.

**Rationale**: 일관된 파일 관리를 위해 정해진 규칙 준수.

**Storage paths**:
- `manufacturers/{manufacturerId}/logo.svg`
- `sale-cars/{saleCarId}/thumb.webp`
- `released-cars/{releasedCarId}/thumb.png`

**Note**: 신규 등록 시 ID가 아직 없으므로, DB insert를 먼저 하거나 timestamp 기반 임시 경로를 사용해야 하는 이슈가 있다. 그러나 설계 원칙상 이미지 → DB 순서이므로, 다음과 같이 처리:
- **등록(POST)**: 업로드 시 timestamp 기반 임시 path로 업로드 → DB insert로 ID 획득 → Storage에서 rename(move) → DB에서 path 갱신
- **대안**: DB insert로 ID를 먼저 받고 이미지를 업로드하되, 이미지 실패 시 DB 레코드 삭제. 그러나 이는 admin-task.md 원칙 위반.
- **실용적 해결책**: `sale-cars/{timestamp}/thumb.webp` 형태로 임시 업로드 후, DB insert 성공 시 해당 path를 그대로 사용. 또는 UUID를 미리 생성하여 경로에 사용.

**최종 결정**: 서버에서 UUID를 미리 생성하여 Storage path에 사용하고, 해당 UUID를 DB의 PK로 사용하지 않고 path 식별자로만 활용. DB의 auto increment ID와는 별도로 관리. 이 방식은 원칙을 준수하면서 move 없이 한 번에 올바른 경로에 업로드할 수 있다.

**수정**: DB의 PK는 BIGINT auto increment이므로, 등록 시에는 `{uuid}` 기반 경로를 사용하고 DB에 해당 path를 저장한다. 수정 시에는 기존 레코드의 ID를 알고 있으므로 `{id}` 기반 경로를 사용할 수 있다.
