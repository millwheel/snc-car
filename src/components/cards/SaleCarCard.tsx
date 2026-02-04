'use client';

import { SaleCarBadge, type SaleCar } from '@/types/saleCar';
import { useQuoteModal } from '@/hooks/useQuoteModal';

interface SaleCarCardProps {
  car: SaleCar;
}

function getBadgeColor(badge: SaleCarBadge): string {
  switch (badge) {
    case SaleCarBadge.IMMEDIATE:
      return 'bg-badge-immediate';
    case SaleCarBadge.PROMOTION:
      return 'bg-badge-promotion';
    default:
      return 'bg-secondary';
  }
}

export default function SaleCarCard({ car }: SaleCarCardProps) {
  const { openModal } = useQuoteModal();

  const handleConsultClick = () => {
    openModal({
      carName: car.carName,
      manufacturerName: car.manufacturerName,
    });
  };

  return (
    <div className="bg-bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* 차량 이미지 */}
      <div className="relative aspect-[4/3] bg-bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center text-text-muted">
          {/* 플레이스홀더 - 실제 이미지로 교체 */}
          <span className="text-sm">{car.carName}</span>
        </div>

        {/* 뱃지 */}
        {car.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {car.badges.map((badge) => (
              <span
                key={badge}
                className={`px-2 py-1 text-xs text-white rounded ${getBadgeColor(badge)}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 차량 정보 */}
      <div className="p-4">
        {/* 제조사 로고/이름 */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-bg-secondary rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-text-secondary">
              {car.manufacturerName.slice(0, 2)}
            </span>
          </div>
          <span className="text-sm text-text-secondary">{car.manufacturerName}</span>
        </div>

        {/* 차량명 */}
        <h3 className="text-lg font-bold text-text-primary mb-3">{car.carName}</h3>

        {/* 가격 정보 */}
        <div className="space-y-1 mb-4">
          <p className="text-sm">
            <span className="text-text-secondary">렌트</span>{' '}
            <span className="font-semibold text-text-primary">
              {car.rentPrice !== null ? `${car.rentPrice.toLocaleString()}원` : '비용문의'}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-text-secondary">리스</span>{' '}
            <span className="font-semibold text-text-primary">
              {car.leasePrice !== null ? `${car.leasePrice.toLocaleString()}원` : '비용문의'}
            </span>
          </p>
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={handleConsultClick}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          간편 상담 신청 &gt;
        </button>
      </div>
    </div>
  );
}
