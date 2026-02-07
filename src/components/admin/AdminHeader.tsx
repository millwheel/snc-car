'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

const NAV_ITEMS = [
  { label: '제조사', href: '/admin/manufacturers' },
  { label: '판매차량', href: '/admin/sale-cars' },
  { label: '출고차량', href: '/admin/released-cars' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="bg-primary-dark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="S&C" width={80} height={32} className="brightness-0 invert" />
          </a>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
