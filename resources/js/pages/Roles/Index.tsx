import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Search, Plus, Shield, Trash2, Eye, Loader2 } from 'lucide-react';

type Role = {
  id: number;
  name: string;
  permissions: string[];
};

type Props = {
  roles: Role[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: '/roles' }];

export default function Index({ roles }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [search, setSearch] = useState('');

  const openDeleteModal = (role: Role) => {
    setRoleToDelete(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeletingId(null);
    setRoleToDelete(null);
  };

  const confirmDelete = () => {
    if (!roleToDelete) return;
    setDeletingId(roleToDelete.id);
    router.delete(route('roles.destroy', roleToDelete.id), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        alert('Failed to delete role. Please try again.');
        closeModal();
      },
    });
  };

  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.permissions.some((p) => p.toLowerCase().includes(q))
    );
  }, [roles, search]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />

      {/* DELETE MODAL - Friendly & Clean */}
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Role
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-red-600">"{roleToDelete?.name}"</span>
                ? This action <strong>cannot be undone</strong>.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  disabled={deletingId !== null}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium shadow-sm hover:bg-red-700 transition flex items-center gap-2"
                >
                  {deletingId ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Role'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Roles Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Organize user access with custom roles and permissions.
          </p>
        </motion.div>

        {/* Search + Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles or permissions..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <Link href={route('roles.create')} className="sm:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </Link>

          <Link href={route('roles.create')} className="hidden sm:block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition"
            >
              <Plus className="w-5 h-5" />
              Create Role
            </motion.button>
          </Link>
        </div>

        {/* ROLES GRID */}
        {filteredRoles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Shield className="w-16 h-16 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No roles found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or create a new role to get started.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all"
              >
                {/* Role Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {role.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: #{role.id}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                {/* Permissions */}
                <div className="mb-5">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Permissions ({role.permissions.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">
                        No permissions
                      </span>
                    ) : (
                      role.permissions.slice(0, 4).map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium"
                        >
                          <div className="w-1 h-1 rounded-full bg-purple-400" />
                          {perm.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      ))
                    )}
                    {role.permissions.length > 4 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{role.permissions.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={route('roles.show', role.id)} className="flex-1">
                    <button className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => openDeleteModal(role)}
                    className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}