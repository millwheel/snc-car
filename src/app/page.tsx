import HeroSection from '@/components/sections/HeroSection';
import SaleCarSection from '@/components/sections/SaleCarSection';
import StrengthSection from '@/components/sections/StrengthSection';
import ReleasedCarSection from '@/components/sections/ReleasedCarSection';
import FAQSection from '@/components/sections/FAQSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 판매 차량 섹션 */}
      <SaleCarSection />

      {/* S&C 강점 섹션 */}
      <StrengthSection />

      {/* 출고 내역 섹션 */}
      <ReleasedCarSection />

      {/* FAQ 섹션 */}
      <FAQSection />
    </main>
  );
}
