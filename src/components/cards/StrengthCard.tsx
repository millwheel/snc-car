interface StrengthCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function StrengthCard({ icon, title, description }: StrengthCardProps) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
      {/* 아이콘 */}
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>

      {/* 제목 */}
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>

      {/* 설명 */}
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
