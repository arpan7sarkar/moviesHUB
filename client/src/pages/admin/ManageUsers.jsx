import { useState } from 'react';
import { FiSearch, FiTrash2, FiChevronLeft, FiChevronRight, FiUser, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useGetUsersQuery, useBanUserMutation, useDeleteUserMutation } from '../../features/admin/adminApi';

const ManageUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useGetUsersQuery({ page, search });
  const [banUser, { isLoading: isBanning }] = useBanUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleBanToggle = async (user) => {
    if (user.role === 'admin') return;
    try {
      await banUser(user._id).unwrap();
    } catch (err) {
      console.error('Failed to toggle ban status:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* ───── Header ───── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Manage Users</h1>
          <p className="text-sm text-text-muted mt-1">
            {total} user{total !== 1 ? 's' : ''} registered
          </p>
        </div>
      </div>

      {/* ───── Filters ───── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <FiSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </form>
      </div>

      {/* ───── Table ───── */}
      <div className="bg-secondary border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wider">User</th>
                <th className="px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wider hidden sm:table-cell">Joined</th>
                <th className="px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3.5" colSpan={5}>
                      <div className="h-10 bg-elevated rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-elevated flex items-center justify-center">
                        <FiUser size={24} className="text-text-muted" />
                      </div>
                      <p className="text-sm text-text-muted">
                        {search ? 'No users found matching your search.' : 'No users registered yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-elevated/50 transition-colors"
                  >
                    {/* User info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-elevated border border-border shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <FiUser size={16} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-text-muted truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs text-text-muted">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          user.role === 'admin'
                            ? 'bg-accent/10 text-accent border border-accent/20'
                            : 'bg-elevated text-text-muted border border-border'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          user.banned
                            ? 'bg-danger/10 text-danger border border-danger/20'
                            : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                        }`}
                      >
                        {user.banned ? (
                          <>
                            <FiXCircle size={12} /> Banned
                          </>
                        ) : (
                          <>
                            <FiCheckCircle size={12} /> Active
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleBanToggle(user)}
                              disabled={isBanning}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                user.banned
                                  ? 'bg-elevated text-text-primary hover:bg-secondary border border-border'
                                  : 'bg-danger/10 text-danger hover:bg-danger/20'
                              }`}
                            >
                              {user.banned ? 'Unban' : 'Ban'}
                            </button>
                            <button
                              onClick={() => setDeleteTarget(user)}
                              className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                              title="Delete User"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-border text-text-muted hover:bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <FiChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-border text-text-muted hover:bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-6 right-6 bg-secondary border border-border rounded-xl px-4 py-2.5 shadow-elevated flex items-center gap-2 z-50">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-text-muted">Loading...</span>
        </div>
      )}

      {/* ───── Delete Confirmation Modal ───── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-secondary border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-elevated">
            <h3 className="text-lg font-semibold text-text-primary">Delete User</h3>
            <p className="text-sm text-text-secondary mt-2">
              Are you sure you want to delete <strong className="text-text-primary">{deleteTarget.name}</strong>?
              This will also delete their favorites, watchlist, and history. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-elevated transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-danger/90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
