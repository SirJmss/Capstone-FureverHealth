import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Lock, Plus, Edit, Trash2, Loader2, Search } from 'lucide-react';

type Permission = { id: number; name: string };
type Props = { permissions: Permission[] };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permissions', href: '/permissions' }];

export default function PermissionsIndex({ permissions }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<Permission | null>(null);
  const [search, setSearch] = useState('');

  const openModal = (p: Permission) => {
    setToDelete(p);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setToDelete(null);
    setDeletingId(null);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setDeletingId(toDelete.id);
    router.delete(route('permissions.destroy', toDelete.id), {
      preserveScroll: true,
      onSuccess: closeModal,
      onError: () => {
        alert('Failed to delete permission.');
        closeModal();
      },
    });
  };

  const filteredPermissions = permissions.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions" />

      {/* ==================== DELETE MODAL ==================== */}
      <AnimatePresence>
        {modalOpen && (
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
                <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Permission
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Permanently remove <strong className="text-red-600">"{toDelete?.name}"</strong>? This action <strong>cannot be undone</strong>.
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
                    'Delete Permission'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-8 h-8 text-purple-600" />
            Permissions Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Define granular access controls for your application.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search permissions..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Create Button - Desktop */}
          <Link href={route('permissions.create')} className="hidden sm:block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition"
            >
              <Plus className="w-5 h-5" />
              Create Permission
            </motion.button>
          </Link>
        </div>

        {/* FAB - Mobile */}
        <Link href={route('permissions.create')} className="sm:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </Link>

        {/* ==================== PERMISSIONS GRID ==================== */}
        {filteredPermissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
              <Lock className="w-16 h-16 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No permissions found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {search ? 'Try adjusting your search.' : 'Create your first permission to get started.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPermissions.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: #{p.id}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={route('permissions.edit', p.id)} className="flex-1">
                    <button className="w-full px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 transition flex items-center justify-center gap-1.5">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => openModal(p)}
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