import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { can } from '@/lib/can';
import { Search, Plus, Clock, DollarSign, User, Tag, Trash2, Eye, Edit, Loader2, ArrowUpDown } from 'lucide-react';

type Service = {
  id: number;
  user_id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category_id: number;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  category?: {
    id: number;
    name: string;
  };
};

type Props = {
  services: Service[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Services', href: '/services' }];

export default function Index({ services }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setServiceToDelete(null);
    setDeletingId(null);
  };

  const confirmDelete = () => {
    if (!serviceToDelete) return;
    setDeletingId(serviceToDelete.id);
    router.delete(route('services.destroy', serviceToDelete.id), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        alert('Failed to delete service.');
        closeModal();
      },
    });
  };

  const filteredServices = useMemo(() => {
    const term = search.toLowerCase();
    const filtered = services.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.user?.first_name.toLowerCase().includes(term) ||
        s.user?.last_name.toLowerCase().includes(term) ||
        s.category?.name.toLowerCase().includes(term)
    );
    return sortOrder === 'desc'
      ? [...filtered].sort((a, b) => b.id - a.id)
      : [...filtered].sort((a, b) => a.id - b.id);
  }, [services, search, sortOrder]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price);

  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration} min`;
    const h = Math.floor(duration / 60);
    const m = duration % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Services" />

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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Service
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Permanently remove <strong className="text-red-600">"{serviceToDelete?.name}"</strong>? This cannot be undone.
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
                    'Delete Service'
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="w-8 h-8 text-indigo-600" />
            Services Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your service offerings, pricing, and providers.
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
              placeholder="Search services, providers, categories..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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

          {/* Create Button - Desktop */}
          {can('services.create') && (
            <Link href={route('services.create')} className="hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Create Service
              </motion.button>
            </Link>
          )}
        </div>

        {/* FAB - Mobile */}
        {can('services.create') && (
          <Link href={route('services.create')} className="sm:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </Link>
        )}

        {/* SERVICES GRID */}
        {filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <Tag className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No services found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Try adjusting your search or create your first service to get started.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: #{service.id}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {service.description || 'No description provided.'}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                    <DollarSign className="w-3.5 h-3.5" />
                    {formatPrice(service.price)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(service.duration)}
                  </span>
                  {service.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                      {service.category.name}
                    </span>
                  )}
                </div>

                {/* Provider */}
                {service.user && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {service.user.first_name[0]}{service.user.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.user.first_name} {service.user.last_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {service.user.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {can('services.view') && (
                    <Link href={route('services.show', service.id)} className="flex-1">
                      <button className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </Link>
                  )}
                  {can('services.edit') && (
                    <Link href={route('services.edit', service.id)} className="flex-1">
                      <button className="w-full px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center justify-center gap-1.5">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                  )}
                  {can('services.delete') && (
                    <button
                      onClick={() => openDeleteModal(service)}
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