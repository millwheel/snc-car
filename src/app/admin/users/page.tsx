'use client';

import { useState, useEffect, useCallback } from 'react';
import Pagination from '@/components/admin/Pagination';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import UserAddModal from '@/components/admin/UserAddModal';
import UserEditModal from '@/components/admin/UserEditModal';
import { formatDate } from '@/utils/formatters';
import type { UserRow, PaginatedResponse } from '@/types/admin';

interface UsersResponse extends PaginatedResponse<UserRow> {
  currentUserId: number;
}

export default function UsersListPage() {
  const [data, setData] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState<UserRow | null>(null);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${p}&limit=10`);
      if (!res.ok) {
        setData([]);
        return;
      }
      const result: UsersResponse = await res.json();
      setData(result.data ?? []);
      setTotalPages(result.totalPages ?? 1);
      setPage(result.page ?? 1);
      setCurrentUserId(result.currentUserId);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteModal(false);
        setDeleteTarget(null);
        await fetchData(page);
      } else {
        const result = await res.json();
        alert(result.error || '삭제에 실패했습니다');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">사용자 관리</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          + 사용자 추가
        </button>
      </div>

      <div className="bg-bg-card rounded-xl shadow-sm overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-primary-dark text-white text-sm">
              <th className="px-4 py-3 text-center font-medium w-[10%]">번호</th>
              <th className="px-4 py-3 text-left font-medium w-[22%]">아이디</th>
              <th className="px-4 py-3 text-left font-medium w-[22%]">닉네임</th>
              <th className="px-4 py-3 text-left font-medium w-[22%]">생성일</th>
              <th className="px-4 py-3 text-center font-medium w-[24%]">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-secondary">로딩 중...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-secondary">등록된 사용자가 없습니다</td>
              </tr>
            ) : (
              data.map((item) => {
                const isSelf = currentUserId === item.id;
                return (
                  <tr
                    key={item.id}
                    className="border-t border-border hover:bg-bg-secondary transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-text-secondary text-center">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{item.username}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{item.nickname}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditTarget(item);
                            setShowEditModal(true);
                          }}
                          className="px-3 py-1 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                          수정
                        </button>
                        {isSelf ? (
                          <span className="px-3 py-1 text-xs text-text-secondary">본인</span>
                        ) : (
                          <button
                            onClick={() => {
                              setDeleteTarget(item);
                              setShowDeleteModal(true);
                            }}
                            disabled={deleting}
                            className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && data.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <UserAddModal
        isOpen={showAddModal}
        onSuccess={() => {
          setShowAddModal(false);
          fetchData(page);
        }}
        onCancel={() => setShowAddModal(false)}
      />

      <UserEditModal
        isOpen={showEditModal}
        user={editTarget}
        onSuccess={() => {
          setShowEditModal(false);
          setEditTarget(null);
          fetchData(page);
        }}
        onCancel={() => {
          setShowEditModal(false);
          setEditTarget(null);
        }}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        itemName={deleteTarget?.nickname ?? ''}
      />
    </div>
  );
}
