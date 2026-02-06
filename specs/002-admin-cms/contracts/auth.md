# API Contract: Authentication

**Feature**: 002-admin-cms

## POST /admin/login (Page Action)

로그인 페이지에서 Supabase Auth `signInWithPassword`를 호출하여 인증을 수행한다.
Route Handler가 아닌 클라이언트에서 직접 Supabase Auth를 호출하는 방식이다.

### Request (Client-side)

```typescript
// LoginForm에서 Supabase browserClient를 사용
const { data, error } = await supabase.auth.signInWithPassword({
  email: string,
  password: string,
});
```

### Success Response

인증 성공 시 Supabase가 자동으로 세션 쿠키를 설정하고, 클라이언트에서 `/admin`으로 리다이렉트한다.

### Error Response

```typescript
{
  error: {
    message: string;  // e.g., "Invalid login credentials"
  }
}
```

## Middleware: /admin/* 경로 보호

### 동작

1. `/admin/login`은 인증 없이 접근 허용
2. `/admin` 및 `/admin/*` (login 제외): `supabase.auth.getUser()` 호출
3. 인증 실패 시 → `302 Redirect` to `/admin/login`
4. 인증 성공 시 → 요청 계속 진행

### Route Handler 인증 (공통)

모든 `/api/admin/*` Route Handler에서:

```typescript
const supabase = createServerClient(cookies);
const { data: { user }, error } = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```
