import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
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

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

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

  // Filter + Sort
  const filteredPets = useMemo(() => {
    const term = search.toLowerCase();
    const filtered = pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(term) ||
        pet.species.toLowerCase().includes(term) ||
        pet.breed.toLowerCase().includes(term)
    );
    return sortOrder === "desc"
      ? [...filtered].sort((a, b) => b.id - a.id)
      : [...filtered].sort((a, b) => a.id - b.id);
  }, [pets, search, sortOrder]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pets" />

      {/* === DELETE MODAL === */}
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
            Pets Management
          </motion.h1>

          {can('pets.create') && (
            <Link href={route('pets.create')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Pet
              </motion.button>
            </Link>
          )}
        </div>

        {/* Search + Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <motion.input
            type="text"
            placeholder="Search by name, species, or breed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          />

          <motion.button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="h-12 px-5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m2 0l4-4m0 0l-4-4m4 4H3" />
            </svg>
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </motion.button>
        </div>

        {/* Table Card */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Species
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Breed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!filteredPets.length ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-500 dark:text-gray-400 italic">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14v7" />
                        </svg>
                        No pets found
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPets.map((pet, index) => (
                    <motion.tr
                      key={pet.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.03 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all duration-200"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white align-middle">
                        #{pet.id}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                          {pet.name}
                        </span>
                      </td>

                      {/* Species */}
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                          {pet.species}
                        </span>
                      </td>

                      {/* Breed */}
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 align-middle">
                        {pet.breed || '—'}
                      </td>

                      {/* Gender */}
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 align-middle">
                        {pet.gender}
                      </td>

                      {/* Age */}
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 align-middle">
                        {pet.age}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex justify-center">
                          <motion.span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                              !pet.deleted_at
                                ? 'text-green-700 dark:text-green-300'
                                : 'text-red-700 dark:text-red-300'
                            }`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.03 }}
                          >
                            {!pet.deleted_at ? 'Active' : 'Deleted'}
                          </motion.span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center justify-center gap-2">
                          {can('pets.view') && (
                            <Link href={route('pets.show', pet.id)}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                title="View"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </motion.button>
                            </Link>
                          )}

                          {can('pets.edit') && (
                            <Link href={route('pets.edit', pet.id)}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </motion.button>
                            </Link>
                          )}

                          {can('pets.delete') && !pet.deleted_at && (
                            <motion.button
                              onClick={() => openDeleteModal(pet)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
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