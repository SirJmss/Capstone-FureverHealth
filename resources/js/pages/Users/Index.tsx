import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { can } from '@/lib/can';


// === TYPES ===
type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  is_active: boolean;
  deleted_at: string | null;
};

type Props = {
  users: User[];
};

// === BREADCRUMBS ===
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

export default function Index({ users }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
      onSuccess: () => closeModal(),
      onError: () => {
        alert('Failed to delete user.');
        closeModal();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      {/* === DELETE MODAL === */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
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
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Confirm Delete
              </h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete{' '}
                <strong>
                  {userToDelete?.first_name} {userToDelete?.last_name}
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  disabled={deletingId !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingId !== null ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HEADER & CREATE BUTTON === */}
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold text-gray-800">User List</h1>




          <Link href={route('users.create')}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition"
            >
              + Create User
            </motion.button>
          </Link>




        </motion.div>

        {/* === TABLE === */}
        <motion.div
          className="overflow-x-auto rounded-2xl shadow-md bg-white border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                {['ID', 'Name', 'Surname', 'Email', 'Address', 'Phone', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="text-left px-6 py-3 text-gray-700 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!users?.length ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-3 border-t text-gray-800">{user.id}</td>
                    <td className="px-6 py-3 border-t text-gray-700">{user.first_name}</td>
                    <td className="px-6 py-3 border-t text-gray-700">{user.last_name}</td>
                    <td className="px-6 py-3 border-t text-gray-700">{user.email}</td>
                    <td className="px-6 py-3 border-t text-gray-700">{user.address || '-'}</td>
                    <td className="px-6 py-3 border-t text-gray-700">{user.phone || '-'}</td>

                    <td className="px-6 py-3 border-t text-center">
                      <motion.span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm ${
                          user.is_active ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </motion.span>
                    </td>

                    <td className="px-6 py-3 border-t text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={route('users.show', user.id)}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 rounded-full text-xs font-medium text-white bg-gray-500 hover:bg-gray-600 transition shadow-sm"
                          >
                            View
                          </motion.div>
                        </Link>

                        <Link href={route('users.edit', user.id)}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 rounded-full text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 transition shadow-sm"
                          >
                            Edit
                          </motion.div>
                        </Link>

                        <motion.button
                          onClick={() => openDeleteModal(user)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-full text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition shadow-sm"
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