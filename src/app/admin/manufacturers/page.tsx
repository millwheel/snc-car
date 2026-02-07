'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/admin/Pagination';
import type { ManufacturerWithAuthor, PaginatedResponse } from '@/types/admin';

export default function ManufacturersListPage() {
  const router = useRouter();
  const [data, setData] = useState<ManufacturerWithAuthor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/manufacturers?page=${p}&limit=10`);
      const result: PaginatedResponse<ManufacturerWithAuthor> = await res.json();
      setData(result.data);
      setTotalPages(result.totalPages);
      setPage(result.page);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">제조사 관리</h1>
        <button
          onClick={() => router.push('/admin/manufacturers/new')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          + 제조사 등록
        </button>
      </div>

      <div className="bg-bg-card rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">로딩 중...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">등록된 제조사가 없습니다</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-primary-dark text-white text-sm">
                <th className="px-4 py-3 text-left font-medium">이름</th>
                <th className="px-4 py-3 text-left font-medium">코드</th>
                <th className="px-4 py-3 text-left font-medium">카테고리</th>
                <th className="px-4 py-3 text-left font-medium">작성자</th>
                <th className="px-4 py-3 text-left font-medium">작성날짜</th>
                <th className="px-4 py-3 text-center font-medium">노출</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.manufacturer_id}
                  onClick={() => router.push(`/admin/manufacturers/${item.manufacturer_id}`)}
                  className="border-t border-border hover:bg-bg-secondary cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{item.code}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {item.category === 'DOMESTIC' ? '국산' : '수입'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {item.users?.nickname || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${item.is_visible ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && data.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
