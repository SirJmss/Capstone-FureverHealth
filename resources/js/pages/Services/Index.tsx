import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { can } from '@/lib/can';

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

  // Search and sort state
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

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

  // Filter and sort logic
  const filteredServices = useMemo(() => {
    const term = search.toLowerCase();
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term) ||
        service.user?.first_name.toLowerCase().includes(term) ||
        service.user?.last_name.toLowerCase().includes(term) ||
        service.category?.name.toLowerCase().includes(term)
    );
    return sortOrder === "desc"
      ? [...filtered].sort((a, b) => b.id - a.id)
      : [...filtered].sort((a, b) => a.id - b.id);
  }, [services, search, sortOrder]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Services" />

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
                Delete Service
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Permanently delete <span className="font-semibold text-red-600">"{serviceToDelete?.name}"</span>? This action{' '}
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
                  {deletingId ? 'Deleting...' : 'Delete Service'}
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
            Services Management
          </motion.h1>

          {can('services.create') && (
            <Link href={route('services.create')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Service
              </motion.button>
            </Link>
          )}
        </div>

        {/* Search + Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm transition hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Sort: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </button>
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
                  {['ID', 'Service Name', 'Description', 'Price', 'Duration', 'Service Provider', 'Category', 'Actions'].map((h) => (
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
                {!filteredServices.length ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        No services found
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, index) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        #{service.id}
                      </td>

                      {/* Service Name */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {service.name}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        <div className="line-clamp-2">
                          {service.description || 'No description'}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {formatPrice(service.price)}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDuration(service.duration)}
                      </td>

                      {/* Service Provider */}
                      <td className="px-6 py-4">
                        {service.user ? (
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {service.user.first_name} {service.user.last_name}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {service.user.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        {service.category ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {service.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Uncategorized</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {can('services.view') && (
                            <Link href={route('services.show', service.id)}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                title="View"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </motion.button>
                            </Link>
                          )}

                          {can('services.edit') && (
                            <Link href={route('services.edit', service.id)}>
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
                          )}

                          {can('services.delete') && (
                            <motion.button
                              onClick={() => openDeleteModal(service)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition"
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