import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// === COLOR PALETTE ===
const colors = [
  'bg-red-100 text-red-700 border-red-300',
  'bg-yellow-100 text-yellow-700 border-yellow-300',
  'bg-green-100 text-green-700 border-green-300',
  'bg-blue-100 text-blue-700 border-blue-300',
  'bg-indigo-100 text-indigo-700 border-indigo-300',
  'bg-purple-100 text-purple-700 border-purple-300',
  'bg-pink-100 text-pink-700 border-pink-300',
  'bg-orange-100 text-orange-700 border-orange-300',
] as const;

// === HASH FUNCTION ===
const getColorClass = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};

// === TYPES ===
type Role = {
  id: number;
  name: string;
  permissions: string[];
};

type Props = {
  roles: Role[];
};

// === BREADCRUMBS ===
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: '/roles' }];

export default function Index({ roles }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const openDeleteModal = (role: Role) => {
    setRoleToDelete(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRoleToDelete(null);
    setDeletingId(null);
  };

  const confirmDelete = () => {
    if (!roleToDelete) return;
    setDeletingId(roleToDelete.id);

    router.delete(route('roles.destroy', roleToDelete.id), {
      preserveScroll: true,
      onSuccess: closeModal,
      onError: () => {
        alert('Failed to delete role.');
        closeModal();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />

      {/* === DELETE MODAL === */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-xl p-6 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Confirm Delete</h3>
              <p className="mb-6 text-gray-600">
                Delete <strong>{roleToDelete?.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  disabled={deletingId !== null}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {deletingId ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MAIN CONTENT === */}
      <motion.div className="p-6">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-2xl font-semibold text-gray-800">Roles List</h1>
          <Link href={route('roles.create')}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition"
            >
              + Create Role
            </motion.button>
          </Link>
        </motion.div>

        {/* Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-md border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {['ID', 'Name', 'Permissions', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No roles found.
                  </td>
                </tr>
              ) : (
                roles.map((role, i) => (
                  <motion.tr
                    key={role.id}
                    className="hover:bg-blue-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="px-6 py-3 border-t text-gray-800">{role.id}</td>
                    <td className="px-6 py-3 border-t text-gray-700 font-medium">{role.name}</td>
                    <td className="px-6 py-3 border-t">
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions.length > 0 ? (
                          role.permissions.map((perm) => (
                            <span
                              key={perm}
                              className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getColorClass(perm)}`}
                            >
                              {perm}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 border-t">
                      <div className="flex gap-2 justify-center">
                        {/* VIEW */}
                        <Link href={route('roles.show', role.id)}>
                          <button className="px-3 py-1.5 text-xs bg-gray-600 text-white rounded-full hover:bg-gray-700 transition">
                            View
                          </button>
                        </Link>

                        {/* EDIT – NOW A BUTTON, SAME STYLE */}
                        <Link href={route('roles.edit', role.id)}>
                          <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                            Edit
                          </button>
                        </Link>

                        {/* DELETE */}
                        <button
                          onClick={() => openDeleteModal(role)}
                          className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
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