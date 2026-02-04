import { mockManufacturers } from '../mocks/manufacturers';
import type { Manufacturer, ManufacturerCategory } from '@/types/manufacturer';

/**
 * 모든 제조사 조회 (isVisible=true, sortOrder 정렬)
 */
export async function getManufacturers(): Promise<Manufacturer[]> {
  return mockManufacturers
    .filter((m) => m.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * 카테고리별 제조사 조회
 */
export async function getManufacturersByCategory(
  category: ManufacturerCategory
): Promise<Manufacturer[]> {
  const manufacturers = await getManufacturers();
  return manufacturers.filter((m) => m.category === category);
}

/**
 * 제조사 코드로 단일 조회
 */
export async function getManufacturerByCode(
  code: string
): Promise<Manufacturer | null> {
  const manufacturers = await getManufacturers();
  return manufacturers.find((m) => m.code === code) || null;
}
