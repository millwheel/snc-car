'use client';

export type AdminTab = 'manufacturers' | 'sale-cars' | 'released-cars';

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const tabs: { key: AdminTab; label: string }[] = [
  { key: 'manufacturers', label: '제조사 관리' },
  { key: 'sale-cars', label: '판매차량 관리' },
  { key: 'released-cars', label: '출고차량 관리' },
];

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="border-b border-border">
      <nav className="flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
