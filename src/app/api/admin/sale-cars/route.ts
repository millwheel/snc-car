import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const ALLOWED_IMAGE_TYPES = ['image/webp', 'image/png', 'image/jpeg'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'public-media';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('sale_cars')
    .select('*, manufacturers(name)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const manufacturerId = formData.get('manufacturer_id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const rentPrice = formData.get('rent_price') as string;
  const leasePrice = formData.get('lease_price') as string;
  const badgesRaw = formData.get('badges') as string;
  const isVisible = formData.get('is_visible') as string;
  const thumbnail = formData.get('thumbnail') as File | null;

  // Validation
  if (!manufacturerId) {
    return NextResponse.json({ error: '제조사를 선택해주세요' }, { status: 400 });
  }
  if (!name || !name.trim()) {
    return NextResponse.json({ error: '차량명은 필수입니다' }, { status: 400 });
  }

  // Verify manufacturer exists
  const { data: mfr } = await supabase
    .from('manufacturers')
    .select('manufacturer_id')
    .eq('manufacturer_id', parseInt(manufacturerId, 10))
    .single();

  if (!mfr) {
    return NextResponse.json({ error: '존재하지 않는 제조사입니다' }, { status: 400 });
  }

  // Parse badges
  let badges: string[] = [];
  if (badgesRaw) {
    try {
      badges = JSON.parse(badgesRaw);
    } catch {
      badges = [];
    }
  }

  // Parse prices
  const parsedRentPrice = rentPrice && rentPrice.trim() !== '' ? parseInt(rentPrice, 10) : null;
  const parsedLeasePrice = leasePrice && leasePrice.trim() !== '' ? parseInt(leasePrice, 10) : null;

  // Upload thumbnail if provided
  let thumbnailPath: string | null = null;
  if (thumbnail && thumbnail.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(thumbnail.type)) {
      return NextResponse.json({ error: '허용된 이미지 형식: WebP, PNG, JPG' }, { status: 400 });
    }
    if (thumbnail.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: '이미지 크기는 5MB 이하여야 합니다' }, { status: 400 });
    }

    const ext = thumbnail.name.split('.').pop() || 'webp';
    const uuid = crypto.randomUUID();
    thumbnailPath = `sale-cars/${uuid}/thumb.${ext}`;

    const arrayBuffer = await thumbnail.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(thumbnailPath, arrayBuffer, { contentType: thumbnail.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: '이미지 업로드 실패: ' + uploadError.message }, { status: 500 });
    }
  }

  // DB insert
  const { data: inserted, error: dbError } = await supabase
    .from('sale_cars')
    .insert({
      manufacturer_id: parseInt(manufacturerId, 10),
      name: name.trim(),
      description: description?.trim() || null,
      thumbnail_path: thumbnailPath,
      rent_price: parsedRentPrice,
      lease_price: parsedLeasePrice,
      badges,
      is_visible: isVisible === 'true',
    })
    .select()
    .single();

  if (dbError) {
    if (thumbnailPath) {
      await supabase.storage.from(BUCKET).remove([thumbnailPath]);
    }
    return NextResponse.json({ error: 'DB 저장 실패: ' + dbError.message }, { status: 500 });
  }

  return NextResponse.json({ data: inserted }, { status: 201 });
}
