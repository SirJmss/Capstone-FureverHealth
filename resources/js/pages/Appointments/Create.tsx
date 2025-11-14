import { useState, useEffect } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PetForm from "@/components/PetForm";
import { motion } from 'framer-motion';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import {
  Calendar, Clock, User, PawPrint, DollarSign, FileText,
  AlertCircle, CheckCircle, XCircle, ChevronLeft, Info, Sparkles,
  Tag, Stethoscope, Save
} from 'lucide-react';

type User = { id: number; first_name: string; last_name: string };
type Pet = { id: number; name: string; user_id: number };
type Service = { id: number; name: string; price: number };
type Timeslot = { 
  id: number; 
  start_time: string; 
  end_time: string; 
  max_appointments: number;
  is_active: boolean;
  description?: string;
};

interface CreateProps {
  users?: User[];
  pets: Pet[];
  services: Service[];
  timeslots: Timeslot[];
  is_admin: boolean;
  existing_schedules?: Array<{
    date: string;
    time_id: number;
  }>;
}

interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
    };
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Appointments', href: '/appointments' },
  { title: 'Create Appointment', href: '/appointments/create' },
];

export default function Create({ users = [], pets, services, timeslots, is_admin, existing_schedules = [] }: CreateProps) {
  const { auth } = usePage<PageProps>().props;
  const [showPetModal, setShowPetModal] = useState(false);
  const [petList, setPetList] = useState(pets);
  const [filteredTimeslots, setFilteredTimeslots] = useState<Timeslot[]>([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<Set<number>>(new Set());

  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    pet_id: '',
    service_id: '',
    date: '',
    time_id: '',
    status: 'pending',
    payment_status: 'unpaid',
    notes: '',
    staff_remarks: '',
  });

  const currentUserId = !is_admin ? auth.user.id.toString() : '';
  const filteredPets =
    is_admin && data.user_id
      ? petList.filter(p => p.user_id === Number(data.user_id))
      : !is_admin
      ? petList.filter(p => p.user_id === auth.user.id)
      : petList;

  // Update booked time slots when date changes
  useEffect(() => {
    if (data.date) {
      const normalizedDate = data.date;
      const bookedForDate = existing_schedules
        .filter(schedule => {
          const scheduleDate = schedule.date.split(' ')[0];
          const scheduleDateNormalized = new Date(scheduleDate).toISOString().split('T')[0];
          return scheduleDateNormalized === normalizedDate;
        })
        .map(schedule => schedule.time_id);
      
      setBookedTimeSlots(new Set(bookedForDate));
    } else {
      setBookedTimeSlots(new Set());
    }
  }, [data.date, existing_schedules]);

  // Handle date change and filter available timeslots
  const handleDateChange = (date: string) => {
    setData('date', date);
    setData('time_id', '');

    if (date) {
      const availableTimeslots = timeslots.filter(timeslot => timeslot.is_active);
      setFilteredTimeslots(availableTimeslots);
    } else {
      setFilteredTimeslots([]);
    }
  };

  const isTimeslotAvailable = (timeslotId: number) => {
    if (!data.date) return true;
    return !bookedTimeSlots.has(timeslotId);
  };

  const availableTimeslotsCount = filteredTimeslots.filter(timeslot => 
    isTimeslotAvailable(timeslot.id)
  ).length;

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'completed' && data.payment_status !== 'paid') {
      setData({
        ...data,
        status: newStatus,
        payment_status: 'paid'
      });
    } else if (newStatus === 'cancelled') {
      setData({
        ...data,
        status: newStatus,
        payment_status: 'unpaid'
      });
    } else {
      setData('status', newStatus);
    }
  };

  const handlePaymentStatusChange = (newPaymentStatus: string) => {
    if (data.status === 'cancelled') {
      alert('Cannot change payment status for cancelled appointments.');
      return;
    }

    if (data.status === 'completed' && newPaymentStatus !== 'paid') {
      if (!confirm('Completed appointments must be marked as paid. Do you want to change the status from "completed" first?')) {
        return;
      }
      setData({
        ...data,
        status: 'confirmed',
        payment_status: newPaymentStatus
      });
    } else {
      setData('payment_status', newPaymentStatus);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (data.date && data.time_id && !isTimeslotAvailable(Number(data.time_id))) {
      alert('This timeslot is already booked. Please select a different timeslot.');
      return;
    }

    if (!data.date) {
      alert('Please select a date for the appointment.');
      return;
    }

    if (!data.time_id) {
      alert('Please select a timeslot for the appointment.');
      return;
    }
    
    if (!is_admin && currentUserId) setData('user_id', currentUserId);
    post(route('appointments.store'));
  };

  const handlePetAdded = (newPet: Pet) => {
    setPetList(prev => [...prev, newPet]);
    setShowPetModal(false);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Invalid Time';
    
    try {
      if (timeString.includes('T')) {
        const timePart = timeString.split('T')[1];
        const timeWithoutMicroseconds = timePart.split('.')[0];
        const [hours, minutes] = timeWithoutMicroseconds.split(':');
        
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        
        if (isNaN(hour) || isNaN(minute)) return 'Invalid Time';
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const twelveHour = hour % 12 || 12;
        const formattedMinutes = minute.toString().padStart(2, '0');
        
        return `${twelveHour}:${formattedMinutes} ${period}`;
      }
      
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      
      if (isNaN(hour) || isNaN(minute)) return 'Invalid Time';
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const twelveHour = hour % 12 || 12;
      const formattedMinutes = minute.toString().padStart(2, '0');
      
      return `${twelveHour}:${formattedMinutes} ${period}`;
    } catch (error) {
      return 'Invalid Time';
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

  const statusConfig = getStatusConfig(data.status);
  const paymentConfig = getPaymentConfig(data.payment_status);
  const StatusIcon = statusConfig.icon;

  const selectedService = services.find(s => s.id === Number(data.service_id));
  const selectedPet = filteredPets.find(p => p.id === Number(data.pet_id));
  const selectedUser = users.find(u => u.id === Number(data.user_id));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Appointment" />

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href={route('appointments.index')}>
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition mb-4 group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Appointments</span>
            </button>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Create Appointment
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Schedule a new pet care appointment
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer & Pet Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Customer & Pet
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Customer Select (Admin Only) */}
                  {is_admin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Customer *
                      </label>
                      <select
                        value={data.user_id}
                        onChange={(e) => setData({ ...data, user_id: e.target.value, pet_id: '' })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        required
                      >
                        <option value="">Select Customer</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.first_name} {u.last_name}
                          </option>
                        ))}
                      </select>
                      <InputError message={errors.user_id} className="mt-1" />
                    </div>
                  )}

                  {/* Pet Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pet *
                    </label>
                    <select
                      value={data.pet_id}
                      onChange={(e) => setData('pet_id', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      required
                      disabled={is_admin && !data.user_id}
                    >
                      <option value="">
                        {is_admin
                          ? data.user_id
                            ? 'Select Pet'
                            : 'Select Customer First'
                          : filteredPets.length === 0
                          ? 'No pets available'
                          : 'Select Pet'}
                      </option>
                      {filteredPets.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {!is_admin && filteredPets.length === 0 && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        You need to add a pet before creating an appointment.
                      </p>
                    )}
                    <InputError message={errors.pet_id} className="mt-1" />
                  </div>
                </div>
              </motion.div>

              {/* Service Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Service Details
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service *
                  </label>
                  <select
                    value={data.service_id}
                    onChange={(e) => setData('service_id', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} - ₱{s.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.service_id} className="mt-1" />
                </div>
              </motion.div>

              {/* Schedule Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Schedule
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={getMinDate()}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      required
                    />
                    <InputError message={errors.date} className="mt-1" />
                  </div>

                  {/* Timeslot */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeslot *
                    </label>
                    <select
                      value={data.time_id}
                      onChange={(e) => setData('time_id', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      required
                      disabled={!data.date}
                    >
                      <option value="">
                        {!data.date 
                          ? 'Select Date First' 
                          : availableTimeslotsCount === 0 
                            ? 'No available timeslots' 
                            : `Select Timeslot (${availableTimeslotsCount} available)`
                        }
                      </option>
                      {filteredTimeslots.map(timeslot => {
                        const isAvailable = isTimeslotAvailable(timeslot.id);
                        return (
                          <option 
                            key={timeslot.id} 
                            value={timeslot.id}
                            disabled={!isAvailable}
                          >
                            {formatTime(timeslot.start_time)} - {formatTime(timeslot.end_time)}
                            {timeslot.description && ` (${timeslot.description})`}
                            {!isAvailable && ' - BOOKED'}
                          </option>
                        );
                      })}
                    </select>
                    {data.date && (
                      <div className="mt-2">
                        {availableTimeslotsCount === 0 ? (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" />
                            All timeslots are booked for this date
                          </p>
                        ) : (
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            {availableTimeslotsCount} timeslot{availableTimeslotsCount !== 1 ? 's' : ''} available
                            {bookedTimeSlots.size > 0 && ` • ${bookedTimeSlots.size} booked`}
                          </p>
                        )}
                      </div>
                    )}
                    <InputError message={errors.time_id} className="mt-1" />
                  </div>
                </div>
              </motion.div>

              {/* Status & Payment (Admin Only) */}
              {is_admin && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <Tag className="w-5 h-5 text-teal-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Status & Payment
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={data.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {data.status === 'completed' && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          Payment status automatically set to "paid"
                        </p>
                      )}
                      {data.status === 'cancelled' && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          Payment status locked to "unpaid"
                        </p>
                      )}
                    </div>

                    {/* Payment Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Status
                      </label>
                      <select
                        value={data.payment_status}
                        onChange={(e) => handlePaymentStatusChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={data.status === 'completed' || data.status === 'cancelled'}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      {data.status === 'completed' && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          Locked to "paid" for completed appointments
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notes Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Additional Information
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Staff Remarks (Admin Only) */}
                  {is_admin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Staff Remarks
                      </label>
                      <textarea
                        value={data.staff_remarks}
                        onChange={(e) => setData('staff_remarks', e.target.value)}
                        placeholder="Internal notes for staff..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Customer Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {is_admin ? 'Customer Notes (Optional)' : 'Notes (Optional)'}
                    </label>
                    <textarea
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                      placeholder={is_admin ? "Customer's special requests..." : "Any special requests..."}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-6 space-y-6">
                {/* Appointment Summary */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl shadow-sm border border-teal-100 dark:border-teal-800 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-teal-600" />
                    Appointment Summary
                  </h3>

                  <div className="space-y-4">
                    {/* Customer Info */}
                    {selectedUser && is_admin && (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                            {selectedUser.first_name[0]}{selectedUser.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {selectedUser.first_name} {selectedUser.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pet Info */}
                    {selectedPet && (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                            <PawPrint className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {selectedPet.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pet</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Service Info */}
                    {selectedService && (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                              {selectedService.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Service</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-teal-600">
                              ₱{selectedService.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date & Time Info */}
                    {data.date && data.time_id && (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(data.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        {(() => {
                          const selectedTimeslot = filteredTimeslots.find(t => t.id === Number(data.time_id));
                          return selectedTimeslot ? (
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formatTime(selectedTimeslot.start_time)} - {formatTime(selectedTimeslot.end_time)}
                                </p>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* Status Badges */}
                    {is_admin && (
                      <div className="space-y-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${statusConfig.color} w-full justify-center`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${paymentConfig.color} w-full justify-center`}>
                          <DollarSign className="w-4 h-4" />
                          {paymentConfig.label}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={processing || (!is_admin && filteredPets.length === 0) || (!!data.date && availableTimeslotsCount === 0)}
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.98 }}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {processing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Save className="w-5 h-5" />
                      </motion.div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Appointment
                    </>
                  )}
                </motion.button>

                {/* Help Text */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <p className="font-medium">Quick Tips:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-1">
                        <li>Select a date to view available timeslots</li>
                        <li>Booked timeslots will be marked</li>
                        {is_admin && <li>Completed appointments auto-set payment to "paid"</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>

      {/* Pet Modal */}
      <Dialog open={showPetModal} onOpenChange={setShowPetModal}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto rounded-2xl p-6"> 
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Pet</DialogTitle>
          </DialogHeader>
          <PetForm onSuccess={handlePetAdded} onClose={() => setShowPetModal(false)} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}