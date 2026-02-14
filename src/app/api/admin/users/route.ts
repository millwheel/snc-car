import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('users')
    .select('id, username, nickname, created_at, updated_at', { count: 'exact' })
    .order('id', { ascending: true })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count ?? 0;

  return NextResponse.json({
    data: data ?? [],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    currentUserId: user.id,
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  const { username, password, nickname } = body;

  // Validation
  if (!username || typeof username !== 'string') {
    return NextResponse.json({ error: '아이디를 입력해주세요' }, { status: 400 });
  }
  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 2 || trimmedUsername.length > 50) {
    return NextResponse.json({ error: '아이디는 2~50자여야 합니다' }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
    return NextResponse.json({ error: '아이디는 영문과 숫자만 가능합니다' }, { status: 400 });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: '비밀번호는 8자 이상이어야 합니다' }, { status: 400 });
  }

  if (!nickname || typeof nickname !== 'string') {
    return NextResponse.json({ error: '닉네임을 입력해주세요' }, { status: 400 });
  }
  const trimmedNickname = nickname.trim();
  if (trimmedNickname.length < 1 || trimmedNickname.length > 50) {
    return NextResponse.json({ error: '닉네임은 1~50자여야 합니다' }, { status: 400 });
  }

  // Hash password
  const passwordHash = await hash(password, 10);

  // Insert
  const { data: inserted, error: dbError } = await supabase
    .from('users')
    .insert({
      username: trimmedUsername,
      password: passwordHash,
      nickname: trimmedNickname,
    })
    .select('id, username, nickname, created_at, updated_at')
    .single();

  if (dbError) {
    if (dbError.code === '23505') {
      return NextResponse.json({ error: '이미 사용 중인 아이디입니다' }, { status: 409 });
    }
    return NextResponse.json({ error: 'DB 저장 실패: ' + dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: inserted }, { status: 201 });
}
