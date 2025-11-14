import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { can } from '@/lib/can';
import { Search, Plus, User, Shield, Mail, Phone, Trash2, Eye, Edit, Loader2, ArrowUpDown, CheckCircle, XCircle } from 'lucide-react';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  roles: string[];
};

type AuthUser = { id: number; first_name: string; last_name: string; email: string; roles: string[] };
type Props = { users: User[]; auth: { user: AuthUser } };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

const ROLE_COLORS: Record<string, string> = {
  Admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Veterinarian: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Pet Groomer': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Customer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

export default function UsersIndex({ users, auth }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
    setDeletingId(null);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    setDeletingId(userToDelete.id);
    router.delete(route('users.destroy', userToDelete.id), {
      preserveScroll: true,
      onSuccess: closeModal,
      onError: () => { alert('Failed to delete user.'); closeModal(); },
    });
  };

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    const filtered = users.filter(u =>
      u.first_name.toLowerCase().includes(term) ||
      u.last_name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
    return sortOrder === 'desc'
      ? [...filtered].sort((a, b) => b.id - a.id)
      : [...filtered].sort((a, b) => a.id - b.id);
  }, [users, search, sortOrder]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete User</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Permanently remove <strong className="text-red-600">{userToDelete?.first_name} {userToDelete?.last_name}</strong>? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={closeModal} disabled={deletingId !== null} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  Cancel
                </button>
                <button onClick={confirmDelete} disabled={deletingId !== null} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium shadow-sm hover:bg-red-700 transition flex items-center gap-2">
                  {deletingId ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete User'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-8 h-8 text-blue-600" />
            Users Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage all registered users and their roles.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
          {can('users.create') && (
            <Link href={route('users.create')} className="hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Create User
              </motion.button>
            </Link>
          )}
        </div>

        {/* FAB - Mobile */}
        {can('users.create') && (
          <Link href={route('users.create')} className="sm:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </Link>
        )}

        {/* USERS GRID */}
        {filteredUsers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No users found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Try adjusting your search or create your first user.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: #{user.id}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{user.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {user.roles.map(role => (
                    <span key={role} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                      <Shield className="w-3.5 h-3.5" />
                      {role}
                    </span>
                  ))}
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {user.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex gap-2">
                  {can('users.view') && (
                    <Link href={route('users.show', user.id)} className="flex-1">
                      <button className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </Link>
                  )}
                  {can('users.edit') && (
                    <Link href={route('users.edit', user.id)} className="flex-1">
                      <button className="w-full px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition flex items-center justify-center gap-1.5">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                  )}
                  {can('users.delete') && (
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}