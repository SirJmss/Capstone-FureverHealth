import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { can } from '@/lib/can';

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: string;
  deleted_at: string | null;
};

type Props = {
  pets: Pet[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pets', href: '/pets' }];

export default function Index({ pets }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  const openDeleteModal = (pet: Pet) => {
    setPetToDelete(pet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPetToDelete(null);
    setDeletingId(null);
  };

  const confirmDelete = () => {
    if (!petToDelete) return;
    setDeletingId(petToDelete.id);
    router.delete(route('pets.destroy', petToDelete.id), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        alert('Failed to delete pet.');
        closeModal();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pets" />

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
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
                Delete Pet
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Permanently delete{' '}
                <span className="font-semibold text-red-600">{petToDelete?.name}</span>? This action{' '}
                <span className="underline">cannot be undone</span>.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={deletingId !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm shadow-lg transition hover:from-red-600 hover:to-red-700 disabled:opacity-50"
                >
                  {deletingId ? 'Deleting...' : 'Delete Pet'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <motion.div className="p-6 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.h1 className="text-3xl font-bold text-gray-900 dark:text-white" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            Pets Management
          </motion.h1>

          {can('pets.create') && (
            <Link href={route('pets.create')}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Pet
              </motion.button>
            </Link>
          )}
        </div>

        {/* Table */}
        <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                  {['ID', 'Name', 'Species', 'Breed', 'Gender', 'Age', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!pets.length ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-500 dark:text-gray-400">
                      No pets found
                    </td>
                  </tr>
                ) : (
                  pets.map((pet, index) => (
                    <motion.tr
                      key={pet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{pet.id}</td>
                      <td className="px-6 py-4">{pet.name}</td>
                      <td className="px-6 py-4">{pet.species}</td>
                      <td className="px-6 py-4">{pet.breed}</td>
                      <td className="px-6 py-4">{pet.gender}</td>
                      <td className="px-6 py-4">{pet.age}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {can('pets.view') && (
                            <Link href={route('pets.show', pet.id)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                              View
                            </Link>
                          )}
                          {can('pets.edit') && (
                            <Link href={route('pets.edit', pet.id)} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition">
                              Edit
                            </Link>
                          )}
                          {can('pets.delete') && (
                            <button onClick={() => openDeleteModal(pet)} className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition">
                              Delete
                            </button>
                          )}
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
