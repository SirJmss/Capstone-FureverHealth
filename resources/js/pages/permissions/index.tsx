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

      {/* ---------- DELETE MODAL ---------- */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Confirm Delete</h3>
              <p className="mb-6 text-gray-600">
                Delete <strong>{toDelete?.name}</strong>? This cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  disabled={deletingId !== null}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {deletingId ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- MAIN CONTENT ---------- */}
      <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <motion.div className="flex items-center justify-between mb-6" initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-semibold text-gray-800">Permissions List</h1>

          <Link href={route('permissions.create')}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
            >
              + Create Permission
            </motion.button>
          </Link>
        </motion.div>

        {/* ---------- TABLE ---------- */}
        <motion.div
          className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                {['ID', 'Name', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">
                    No permissions found.
                  </td>
                </tr>
              ) : (
                permissions.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-3 border-t text-gray-800">{p.id}</td>
                    <td className="px-6 py-3 border-t text-gray-700">{p.name}</td>

                    <td className="px-6 py-3 border-t text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={route('permissions.edit', p.id)}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-600 transition"
                          >
                            Edit
                          </motion.div>
                        </Link>

                        <motion.button
                          onClick={() => openModal(p)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-600 transition"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}