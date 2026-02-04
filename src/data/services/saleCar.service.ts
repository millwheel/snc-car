import { mockSaleCars } from '../mocks/saleCars';
import { getManufacturersByCategory } from './manufacturer.service';
import type { SaleCar } from '@/types/saleCar';
import type { ManufacturerCategory } from '@/types/manufacturer';

/**
 * 모든 판매 차량 조회 (isVisible=true, 정렬 적용)
 * 정렬: sortOrder ASC, createdAt DESC
 */
export async function getSaleCars(): Promise<SaleCar[]> {
  return mockSaleCars
    .filter((car) => car.isVisible)
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * 제조사별 판매 차량 조회
 */
export async function getSaleCarsByManufacturer(
  manufacturerCode: string
): Promise<SaleCar[]> {
  const cars = await getSaleCars();
  return cars.filter((car) => car.manufacturerCode === manufacturerCode);
}

/**
 * 카테고리별 판매 차량 조회 (국산/수입)
 */
export async function getSaleCarsByCategory(
  category: ManufacturerCategory
): Promise<SaleCar[]> {
  const manufacturers = await getManufacturersByCategory(category);
  const validCodes = manufacturers.map((m) => m.code);
  const cars = await getSaleCars();
  return cars.filter((car) => validCodes.includes(car.manufacturerCode));
}

/**
 * 필터 조합으로 판매 차량 조회
 */
export async function getFilteredSaleCars(params: {
  category?: ManufacturerCategory;
  manufacturerCode?: string;
}): Promise<SaleCar[]> {
  let cars = await getSaleCars();

  if (params.category) {
    const manufacturers = await getManufacturersByCategory(params.category);
    const validCodes = manufacturers.map((m) => m.code);
    cars = cars.filter((car) => validCodes.includes(car.manufacturerCode));
  }

  if (params.manufacturerCode) {
    cars = cars.filter((car) => car.manufacturerCode === params.manufacturerCode);
  }

  return cars;
}
