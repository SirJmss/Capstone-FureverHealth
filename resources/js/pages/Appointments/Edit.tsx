import { useState, useEffect } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import PetForm from "@/components/PetForm";
import InputError from "@/components/input-error";
import { type BreadcrumbItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, User, PawPrint, DollarSign, Edit3, AlertCircle,
  CheckCircle, XCircle, Plus, Loader2, ChevronLeft, Info
} from 'lucide-react';

interface AppointmentProps {
  pets: { id: number; name: string; user_id: number }[];
  services: { id: number; name: string; price: number }[];
  timeslots: { 
    id: number; 
    start_time: string; 
    end_time: string; 
    max_appointments: number;
    is_active: boolean;
    description?: string;
  }[];
  users?: { id: number; first_name: string; last_name: string }[];
  is_admin: boolean;
  appointment: {
    id: number;
    user_id: number;
    pet_id: number;
    service_id: number;
    date: string;
    time_id: number;
    status: string;
    notes: string;
    staff_remarks?: string;
    payment_status: string;
    schedule?: {
      date: string;
      time_id: number;
    };
  };
  existing_schedules?: Array<{
    date: string;
    time_id: number;
  }>;
}

interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      first_name: string;
      last_name: string;
    };
  };
  [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Appointments", href: "/appointments" },
  { title: "Edit Appointment", href: "" },
];

export default function EditAppointment({
  pets,
  services,
  timeslots,
  users,
  is_admin,
  appointment,
  existing_schedules = [],
}: AppointmentProps) {
  const [showPetModal, setShowPetModal] = useState(false);
  const { auth } = usePage<PageProps>().props;
  const [bookedTimeSlots, setBookedTimeSlots] = useState<Set<number>>(new Set());
  
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '';
  };

  const initialDate = formatDateForInput(appointment.schedule?.date || appointment.date);
  const initialTimeId = appointment.schedule?.time_id || appointment.time_id;

  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [filteredTimeslots, setFilteredTimeslots] = useState(timeslots.filter(t => t.is_active));

  const userPets = is_admin ? pets : pets.filter(pet => pet.user_id === auth.user.id);
  const [petList, setPetList] = useState(userPets);

  const { data, setData, put, processing, errors } = useForm({
    user_id: appointment.user_id.toString(),
    pet_id: appointment.pet_id?.toString() || "",
    service_id: appointment.service_id?.toString() || "",
    date: initialDate || "",
    time_id: initialTimeId?.toString() || "",
    status: appointment.status || "pending",
    notes: appointment.notes || "",
    staff_remarks: appointment.staff_remarks || "",
    payment_status: appointment.payment_status || "unpaid",
  });

  useEffect(() => {
    if (data.date) {
      const normalizedDate = data.date;
      const bookedForDate = existing_schedules
        .filter(s => {
          const scheduleDate = s.date.split(' ')[0];
          const normalized = new Date(scheduleDate).toISOString().split('T')[0];
          const matches = normalized === normalizedDate;
          const isCurrent = normalized === initialDate && s.time_id === initialTimeId;
          return matches && !isCurrent;
        })
        .map(s => s.time_id);
      setBookedTimeSlots(new Set(bookedForDate));
    } else {
      setBookedTimeSlots(new Set());
    }
  }, [data.date, existing_schedules, initialDate, initialTimeId]);

  const filteredPets = is_admin && data.user_id
    ? petList.filter(p => p.user_id === Number(data.user_id))
    : !is_admin
    ? petList.filter(p => p.user_id === auth.user.id)
    : petList;

  const isTimeslotAvailable = (timeslotId: number) => {
    if (!data.date) return true;
    const isCurrent = timeslotId === initialTimeId && data.date === initialDate;
    return isCurrent || !bookedTimeSlots.has(timeslotId);
  };

  const availableTimeslotsCount = filteredTimeslots.filter(t => isTimeslotAvailable(t.id)).length;

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setData('date', date);
    setFilteredTimeslots(date ? timeslots.filter(t => t.is_active) : []);
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'completed' && data.payment_status !== 'paid') {
      setData({ ...data, status: newStatus, payment_status: 'paid' });
    } else if (newStatus === 'cancelled') {
      setData({ ...data, status: newStatus, payment_status: 'unpaid' });
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
      if (!confirm('Completed appointments must be marked as paid. Do you want to change the status from "completed" first?')) return;
      setData({ ...data, status: 'confirmed', payment_status: newPaymentStatus });
    } else {
      setData('payment_status', newPaymentStatus);
    }
  };

  const submitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.status !== 'completed') {
      if (data.date && data.time_id) {
        const selectedTimeId = Number(data.time_id);
        const isCurrent = selectedTimeId === initialTimeId && data.date === initialDate;
        if (!isCurrent && !isTimeslotAvailable(selectedTimeId)) {
          alert('This timeslot is already booked. Please select a different timeslot.');
          return;
        }
      }
      if (!data.date) { alert('Please select a date for the appointment.'); return; }
      if (!data.time_id) { alert('Please select a timeslot for the appointment.'); return; }
    }
    put(route("appointments.update", appointment.id));
  };

  const handlePetAdded = (newPet: any) => {
    if (newPet.user_id === auth.user.id) {
      setPetList(prev => [...prev, newPet]);
    }
    setShowPetModal(false);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Invalid Time';
    try {
      let timePart = timeString.includes('T') ? timeString.split('T')[1].split('.')[0] : timeString;
      const [hours, minutes] = timePart.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const twelveHour = hour % 12 || 12;
      return `${twelveHour}:${minute.toString().padStart(2, '0')} ${period}`;
    } catch {
      return 'Invalid Time';
    }
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!is_admin) setData('user_id', auth.user.id.toString());
  }, [is_admin, auth.user.id, setData]);

  const isCompletedAppointment = data.status === 'completed';

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Appointment" />

      <motion.div
        className="p-4 sm:p-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-8 h-8 text-teal-600" />
                Edit Appointment
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update appointment details and schedule.
              </p>
            </div>
            <Link href={route("appointments.index")}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </motion.button>
            </Link>
          </div>

          {/* Completed Warning */}
          {isCompletedAppointment && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Completed Appointment</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This appointment is marked as completed. Date and timeslot are no longer required.
                </p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={submitAppointment} className="space-y-6">
            {/* ADMIN: Customer Select */}
            {is_admin && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 text-teal-600" />
                  Customer
                </label>
                <select
                  value={data.user_id}
                  onChange={(e) => setData({ ...data, user_id: e.target.value, pet_id: '' })}
                  className="mt-2 w-full h-12 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                >
                  <option value="">Select Customer</option>
                  {users?.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
                <InputError message={errors.user_id} className="mt-1" />
              </motion.div>
            )}

            {/* Date & Time - Only for non-completed */}
            {!isCompletedAppointment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={getMinDate()}
                    className="mt-2 w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                  <InputError message={errors.date} className="mt-1" />
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Timeslot
                  </label>
                  <select
                    value={data.time_id}
                    onChange={(e) => setData("time_id", e.target.value)}
                    disabled={!data.date}
                    className="mt-2 w-full h-12 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:opacity-50"
                  >
                    <option value="">
                      {!data.date ? 'Select Date First' : availableTimeslotsCount === 0 ? 'No available timeslots' : `Select Timeslot (${availableTimeslotsCount} available)`}
                    </option>
                    {filteredTimeslots.map(timeslot => {
                      const isAvailable = isTimeslotAvailable(timeslot.id);
                      const isCurrent = timeslot.id === initialTimeId && data.date === initialDate;
                      return (
                        <option 
                          key={timeslot.id} 
                          value={timeslot.id}
                          disabled={!isAvailable}
                          className={!isAvailable ? 'text-gray-400 line-through' : ''}
                        >
                          {formatTime(timeslot.start_time)} - {formatTime(timeslot.end_time)}
                          {timeslot.description && ` (${timeslot.description})`}
                          {isCurrent && ' - CURRENT'}
                          {!isAvailable && !isCurrent && ' - BOOKED'}
                        </option>
                      );
                    })}
                  </select>
                  {data.date && (
                    <div className="mt-1 text-sm">
                      {availableTimeslotsCount === 0 ? (
                        <p className="text-red-600 dark:text-red-400 font-medium">
                          All timeslots booked. Choose another date.
                        </p>
                      ) : (
                        <p className="text-green-600 dark:text-green-400">
                          {availableTimeslotsCount} available
                          {bookedTimeSlots.size > 0 && ` • ${bookedTimeSlots.size} booked`}
                        </p>
                      )}
                    </div>
                  )}
                  <InputError message={errors.time_id} className="mt-1" />
                </motion.div>
              </div>
            )}

            {/* Pet Selection */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <PawPrint className="w-4 h-4 text-teal-600" />
                Select Pet
              </label>
              <div className="flex gap-3 mt-2">
                <select
                  value={data.pet_id}
                  onChange={(e) => setData("pet_id", e.target.value)}
                  disabled={is_admin && !data.user_id}
                  className="flex-1 h-12 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                >
                  <option value="">
                    {is_admin ? (data.user_id ? 'Select Pet' : 'Select Customer First') : filteredPets.length === 0 ? 'No pets' : 'Select Pet'}
                  </option>
                  {filteredPets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
                {!is_admin && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPetModal(true)}
                    className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Pet
                  </motion.button>
                )}
              </div>
              {!is_admin && filteredPets.length === 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  You need to add a pet before updating.
                </p>
              )}
              <InputError message={errors.pet_id} className="mt-1" />
            </motion.div>

            {/* Service */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 text-teal-600" />
                Service
              </label>
              <select
                value={data.service_id}
                onChange={(e) => setData("service_id", e.target.value)}
                className="mt-2 w-full h-12 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              >
                <option value="">Select Service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ₱{service.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <InputError message={errors.service_id} className="mt-1" />
            </motion.div>

            {/* Admin: Status & Payment */}
            {is_admin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="mt-2 w-full h-12 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {data.status === 'completed' && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">Payment auto-set to "paid"</p>
                  )}
                  {data.status === 'cancelled' && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Payment locked to "unpaid"</p>
                  )}
                  <InputError message={errors.status} className="mt-1" />
                </motion.div>

                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <DollarSign className="w-4 h-4 text-teal-600" />
                    Payment Status
                  </label>
                  <select
                    value={data.payment_status}
                    onChange={(e) => handlePaymentStatusChange(e.target.value)}
                    disabled={data.status === 'completed' || data.status === 'cancelled'}
                    className="mt-2 w-full h-12 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:opacity-50"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  {data.status === 'completed' && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Locked to "paid"</p>
                  )}
                  {data.status === 'cancelled' && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Locked to "unpaid"</p>
                  )}
                  <InputError message={errors.payment_status} className="mt-1" />
                </motion.div>
              </div>
            )}

            {/* Notes */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Notes
              </label>
              <textarea
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
                className="mt-2 w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                placeholder="Special requests or notes..."
                rows={3}
              />
              <InputError message={errors.notes} className="mt-1" />
            </motion.div>

            {/* Staff Remarks */}
            {is_admin && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Staff Remarks
                </label>
                <textarea
                  value={data.staff_remarks}
                  onChange={(e) => setData("staff_remarks", e.target.value)}
                  className="mt-2 w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                  placeholder="Internal notes..."
                  rows={3}
                />
                <InputError message={errors.staff_remarks} className="mt-1" />
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              className="pt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="submit"
                disabled={processing || (!is_admin && filteredPets.length === 0) || (!!data.date && !isCompletedAppointment && availableTimeslotsCount === 0)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Appointment'
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      {/* Pet Modal */}
      <AnimatePresence>
        {showPetModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPetModal(false)}
          >
            <motion.div
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <PawPrint className="w-6 h-6 text-teal-600" />
                  Add New Pet
                </h3>
                <button
                  onClick={() => setShowPetModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <PetForm onSuccess={handlePetAdded} onClose={() => setShowPetModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}