import type { ReleasedCar } from '@/types/releasedCar';
import { formatReleasedDate } from '@/utils/formatters';

interface ReleasedCarCardProps {
  car: ReleasedCar;
}

export default function ReleasedCarCard({ car }: ReleasedCarCardProps) {
  return (
    <div className="bg-bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* 차량 이미지 */}
      <div className="relative aspect-[4/3] bg-bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center text-text-muted">
          {/* 플레이스홀더 - 실제 이미지로 교체 */}
          <span className="text-sm">{car.carName}</span>
        </div>
      </div>

      {/* 차량 정보 */}
      <div className="p-4">
        <h3 className="text-base font-bold text-text-primary mb-1 line-clamp-1">
          {car.carName}
        </h3>
        <p className="text-sm text-text-secondary">
          {formatReleasedDate(car.releasedAt)}
        </p>
      </div>
    </div>
  );
}
