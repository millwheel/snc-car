export function getPublicImageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || process.env.SUPABASE_STORAGE_BUCKET || 'public-media';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
