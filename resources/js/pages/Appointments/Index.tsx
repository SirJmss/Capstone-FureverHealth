import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { can } from '@/lib/can';
import {
  Search, Plus, Calendar, Clock, User, PawPrint, DollarSign,
  AlertCircle, CheckCircle, XCircle, Trash2, Eye, Edit, Loader2,
  ArrowUpDown, Info
} from 'lucide-react';

type User = { id: number; first_name: string; last_name: string };
type Pet = { id: number; name: string };
type Service = { id: number; name: string; price: number };
type TimeSlot = {
  id: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  description?: string;
};
type Schedule = {
  id: number;
  date: string;
  time_id: number;
  status: string;
  notes?: string;
  timeslot: TimeSlot;
  appointment: {
    id: number;
    user_id: number;
    pet_id: number;
    service_id: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    payment_status: 'unpaid' | 'paid' | 'refunded';
    notes: string | null;
    staff_remarks: string | null;
    service_fee: number | null;
    user: User;
    pet: Pet;
    service: Service;
  };
};

type Props = { schedules: Schedule[] };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Appointments', href: '/appointments' }];

const formatTime = (timeString: string) => {
  if (!timeString) return '--:--';
  try {
    const timePart = timeString.includes('T') ? timeString.split('T')[1].split('.')[0] : timeString;
    return timePart.substring(0, 5);
  } catch {
    return '--:--';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function AppointmentsIndex({ schedules }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const openDeleteModal = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setScheduleToDelete(null);
    setDeletingId(null);
  };

  const confirmDelete = () => {
    if (!scheduleToDelete) return;
    setDeletingId(scheduleToDelete.appointment.id);
    router.delete(route('appointments.destroy', scheduleToDelete.appointment.id), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        alert('Failed to delete appointment.');
        closeModal();
      },
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Pending' };
      case 'confirmed': return { icon: CheckCircle, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', label: 'Confirmed' };
      case 'completed': return { icon: CheckCircle, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: 'Completed' };
      case 'cancelled': return { icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: 'Cancelled' };
      default: return { icon: Info, color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', label: status };
    }
  };

  const getPaymentConfig = (status: string) => {
    switch (status) {
      case 'paid': return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: 'Paid' };
      case 'unpaid': return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: 'Unpaid' };
      case 'refunded': return { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', label: 'Refunded' };
      default: return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', label: status };
    }
  };

  const filteredSchedules = useMemo(() => {
    const active = schedules.filter(s => s.appointment.status !== 'completed');
    const term = search.toLowerCase();
    const filtered = active.filter(s =>
      s.appointment.pet.name.toLowerCase().includes(term) ||
      `${s.appointment.user.first_name} ${s.appointment.user.last_name}`.toLowerCase().includes(term) ||
      s.appointment.service.name.toLowerCase().includes(term)
    );
    return sortOrder === 'desc'
      ? [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [schedules, search, sortOrder]);

  const completedCount = schedules.filter(s => s.appointment.status === 'completed').length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Appointments" />

      {/* ==================== DELETE MODAL ==================== */}
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
                  Delete Appointment
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Permanently remove appointment for{' '}
                <strong className="text-red-600">{scheduleToDelete?.appointment.pet.name}</strong>
                {' '}with{' '}
                <strong>{scheduleToDelete?.appointment.user.first_name} {scheduleToDelete?.appointment.user.last_name}</strong>?
                This action <strong>cannot be undone</strong>.
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
                    'Delete Appointment'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-8 h-8 text-teal-600" />
                Appointments
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Manage upcoming pet care appointments.
              </p>
            </div>
            {completedCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                <Info className="w-3.5 h-3.5" />
                {completedCount} completed hidden
              </div>
            )}
          </div>
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
              placeholder="Search pet, owner, or service..."
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

          {/* Create Button - Desktop */}
          {can('appointments.create') && (
            <Link href={route('appointments.create')} className="hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Create Appointment
              </motion.button>
            </Link>
          )}
        </div>

        {/* FAB - Mobile */}
        {can('appointments.create') && (
          <Link href={route('appointments.create')} className="sm:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </Link>
        )}

        {/* ==================== APPOINTMENTS GRID ==================== */}
        {filteredSchedules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center">
              <PawPrint className="w-16 h-16 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No active appointments
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              All caught up! Create a new appointment or adjust your search.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((schedule, idx) => {
              const status = getStatusConfig(schedule.appointment.status);
              const payment = getPaymentConfig(schedule.appointment.payment_status);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {schedule.appointment.pet.name}
                        </h3>
                        <PawPrint className="w-4 h-4 text-teal-600" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ID: #{schedule.appointment.id}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {schedule.appointment.user.first_name[0]}{schedule.appointment.user.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {schedule.appointment.user.first_name} {schedule.appointment.user.last_name}
                      </p>
                    </div>
                  </div>

                  {/* Service & Price */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {schedule.appointment.service.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ₱{schedule.appointment.service.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      {formatDate(schedule.date)}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      {formatTime(schedule.timeslot.start_time)} - {formatTime(schedule.timeslot.end_time)}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${payment.color}`}>
                      <DollarSign className="w-3 h-3" />
                      {payment.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {can('appointments.view') && (
                      <Link href={route('appointments.show', schedule.appointment.id)} className="flex-1">
                        <button className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </Link>
                    )}
                    {can('appointments.edit') && (
                      <Link href={route('appointments.edit', schedule.appointment.id)} className="flex-1">
                        <button className="w-full px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 transition flex items-center justify-center gap-1.5">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </Link>
                    )}
                    {can('appointments.delete') && (
                      <button
                        onClick={() => openDeleteModal(schedule)}
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