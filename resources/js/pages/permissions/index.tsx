import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type Permission = { id: number; name: string };
type Props = { permissions: Permission[] };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permissions', href: '/permissions' }];

export default function Index({ permissions }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<Permission | null>(null);

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions" />

      {/* === DELETE MODAL === */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 shadow-2xl border border-white/20"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                Delete Permission
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Permanently delete <span className="font-semibold text-red-600">"{toDelete?.name}"</span>? This action{' '}
                <span className="underline">cannot be undone</span>.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  disabled={deletingId !== null}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm shadow-lg transition hover:from-red-600 hover:to-red-700 disabled:opacity-50"
                >
                  {deletingId ? 'Deleting...' : 'Delete Permission'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MAIN CONTENT === */}
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Permissions Management
          </motion.h1>

          <Link href={route('permissions.create')}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Permission
            </motion.button>
          </Link>
        </div>

        {/* Table Card */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                  {['ID', 'Permission Name', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {permissions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-16 text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        No permissions found
                      </div>
                    </td>
                  </tr>
                ) : (
                  permissions.map((p, index) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        #{p.id}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold text-indigo-800 dark:from-indigo-900 dark:to-indigo-800 dark:text-indigo-200">
                          {p.name}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={route('permissions.edit', p.id)}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </motion.button>
                          </Link>

                          <motion.button
                            onClick={() => openModal(p)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}