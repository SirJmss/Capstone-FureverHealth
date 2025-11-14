import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { can } from '@/lib/can';
import {
  Search,
  Plus,
  PawPrint,
  Calendar,
  Edit,
  Trash2,
  Loader2,
  Eye,
  AlertCircle,
  CheckCircle,
  ArrowUpDown,
} from 'lucide-react';

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: string;
  deleted_at: string | null;
};

type Props = { pets: Pet[] };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pets', href: '/pets' }];

export default function PetsIndex({ pets }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

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
      onSuccess: closeModal,
      onError: () => {
        alert('Failed to delete pet.');
        closeModal();
      },
    });
  };

  const filteredPets = useMemo(() => {
    const term = search.toLowerCase();
    const filtered = pets.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.species.toLowerCase().includes(term) ||
        p.breed.toLowerCase().includes(term)
    );
    return sortOrder === 'desc'
      ? [...filtered].sort((a, b) => b.id - a.id)
      : [...filtered].sort((a, b) => a.id - b.id);
  }, [pets, search, sortOrder]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pets" />

      {/* ────── DELETE MODAL ────── */}
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
                <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Pet
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Permanently remove{' '}
                <strong className="text-red-600">{petToDelete?.name}</strong>? This
                action <strong>cannot be undone</strong>.
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
                    'Delete Pet'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────── MAIN CONTENT ────── mur */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <PawPrint className="w-8 h-8 text-teal-600" />
            Pets Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage all registered pets and their details.
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
              placeholder="Search by name, species, or breed..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>

          {/* Create – Desktop */}
          {can('pets.create') && (
            <Link href={route('pets.create')} className="hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Create Pet
              </motion.button>
            </Link>
          )}
        </div>

        {/* FAB – Mobile */}
        {can('pets.create') && (
          <Link href={route('pets.create')} className="sm:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </Link>
        )}

        {/* ────── PETS GRID ────── */}
        {filteredPets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center">
              <PawPrint className="w-16 h-16 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No pets found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {search
                ? 'Try adjusting your search.'
                : 'Add your first pet to get started!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet, idx) => {
              const isActive = !pet.deleted_at;
              const StatusIcon = isActive ? CheckCircle : AlertCircle;
              const statusColor = isActive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';

              return (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                        {pet.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ID: #{pet.id}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${statusColor}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {pet.name[0].toUpperCase()}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Species</span>
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        {pet.species}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Breed</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {pet.breed || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gender</span>
                      <span className="font-medium text-pink-600 dark:text-pink-400">
                        {pet.gender}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Age</span>
                      <span className="font-medium text-teal-600 dark:text-teal-400">
                        {pet.age}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 flex justify-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {isActive ? 'Active' : 'Deleted'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2">
                    {can('pets.view') && (
                      <Link href={route('pets.show', pet.id)} className="flex-1">
                        <button className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </Link>
                    )}
                    {can('pets.edit') && (
                      <Link href={route('pets.edit', pet.id)} className="flex-1">
                        <button className="w-full px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 transition flex items-center justify-center gap-1.5">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </Link>
                    )}
                    {can('pets.delete') && isActive && (
                      <button
                        onClick={() => openDeleteModal(pet)}
                        className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}