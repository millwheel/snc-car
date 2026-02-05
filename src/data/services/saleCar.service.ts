import { mockSaleCars } from '../mocks/saleCars';
import { getManufacturersByCategory } from './manufacturer.service';
import type { SaleCar } from '@/types/saleCar';
import type { ManufacturerCategory } from '@/types/manufacturer';

/**
 * 모든 판매 차량 조회 (isVisible=true, 정렬 적용)
 * 정렬: createdAt DESC
 */
export async function getSaleCars(): Promise<SaleCar[]> {
  return mockSaleCars
    .filter((car) => car.isVisible)
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * 제조사별 판매 차량 조회
 */
export async function getSaleCarsByManufacturer(
  manufacturerId: string
): Promise<SaleCar[]> {
  const cars = await getSaleCars();
  return cars.filter((car) => car.manufacturerId === manufacturerId);
}

/**
 * 카테고리별 판매 차량 조회 (국산/수입)
 */
export async function getSaleCarsByCategory(
  category: ManufacturerCategory
): Promise<SaleCar[]> {
  const manufacturers = await getManufacturersByCategory(category);
  const validIds = manufacturers.map((m) => m.id);
  const cars = await getSaleCars();
  return cars.filter((car) => validIds.includes(car.manufacturerId));
}

/**
 * 필터 조합으로 판매 차량 조회
 */
export async function getFilteredSaleCars(params: {
  category?: ManufacturerCategory;
  manufacturerId?: string;
}): Promise<SaleCar[]> {
  let cars = await getSaleCars();

  if (params.category) {
    const manufacturers = await getManufacturersByCategory(params.category);
    const validIds = manufacturers.map((m) => m.id);
    cars = cars.filter((car) => validIds.includes(car.manufacturerId));
  }

  if (params.manufacturerId) {
    cars = cars.filter((car) => car.manufacturerId === params.manufacturerId);
  }

  return cars;
}
