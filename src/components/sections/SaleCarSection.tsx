'use client';

import { useEffect, useState } from 'react';
import ManufacturerFilter from '@/components/filters/ManufacturerFilter';
import SaleCarCard from '@/components/cards/SaleCarCard';
import type { Manufacturer, ManufacturerCategory } from '@/types/manufacturer';
import type { SaleCar } from '@/types/saleCar';

interface SaleCarSectionProps {
  sectionId: string;
  title: string;
  category: ManufacturerCategory;
}

export default function SaleCarSection({ sectionId, title, category }: SaleCarSectionProps) {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [cars, setCars] = useState<SaleCar[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [mfRes, carsRes] = await Promise.all([
          fetch('/api/public/manufacturers'),
          fetch('/api/public/sale-cars'),
        ]);
        const [mfJson, carsJson] = await Promise.all([mfRes.json(), carsRes.json()]);

        const allManufacturers: Manufacturer[] = mfJson.data ?? [];
        const allCars: SaleCar[] = carsJson.data ?? [];

        // 카테고리에 해당하는 제조사만 필터링
        const filteredMfs = allManufacturers.filter((m) => m.category === category);
        const validIds = filteredMfs.map((m) => m.manufacturer_id);

        setManufacturers(filteredMfs);
        setCars(allCars.filter((car) => validIds.includes(car.manufacturer_id)));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [category]);

  const handleManufacturerSelect = (id: number | null) => {
    setSelectedManufacturer((prev) => (prev === id ? null : id));
  };

  const displayedCars = selectedManufacturer
    ? cars.filter((car) => car.manufacturer_id === selectedManufacturer)
    : cars;

  if (isLoading) {
    return (
      <section id={sectionId} className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center text-text-muted">로딩 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId} className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 섹션 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        </div>

        {/* 제조사 필터 */}
        <div className="mb-8">
          <ManufacturerFilter
            manufacturers={manufacturers}
            selectedCode={selectedManufacturer}
            onSelect={handleManufacturerSelect}
          />
        </div>

        {/* 차량 그리드 */}
        {displayedCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCars.slice(0, 12).map((car) => (
              <SaleCarCard key={car.sale_car_id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted">
            조건에 맞는 차량이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
