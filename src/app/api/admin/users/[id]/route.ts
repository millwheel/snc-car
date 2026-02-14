import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const { id } = await params;
  const userId = parseInt(id, 10);

  // Prevent self-deletion
  if (user.id === userId) {
    return NextResponse.json({ error: '본인 계정은 삭제할 수 없습니다' }, { status: 403 });
  }

  // Check minimum user count
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if ((count ?? 0) <= 1) {
    return NextResponse.json({ error: '최소 1명의 사용자가 필요합니다' }, { status: 400 });
  }

  // Check target exists
  const { data: existing, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
  }

  // Delete
  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (deleteError) {
    return NextResponse.json({ error: 'DB 삭제 실패: ' + deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: '삭제되었습니다' });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const { id } = await params;
  const userId = parseInt(id, 10);

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  const { password } = body;

  if (!password || typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: '비밀번호는 8자 이상이어야 합니다' }, { status: 400 });
  }

  // Check target exists
  const { data: existing, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
  }

  const passwordHash = await hash(password, 10);

  const { error: updateError } = await supabase
    .from('users')
    .update({ password: passwordHash })
    .eq('id', userId);

  if (updateError) {
    return NextResponse.json({ error: 'DB 수정 실패: ' + updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: '비밀번호가 변경되었습니다' });
}
