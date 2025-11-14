import { useState, useEffect } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { route } from "ziggy-js";
import PetForm from "@/components/PetForm";
import InputError from "@/components/input-error";
import { type BreadcrumbItem } from "@/types";

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
    date: string; // This now comes from schedule
    time_id: number; // This now comes from schedule
    status: string;
    notes: string;
    staff_remarks?: string;
    payment_status: string;
    schedule?: {
      date: string;
      time_id: number;
    };
  };
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

// Breadcrumbs
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
}: AppointmentProps) {
  const [showPetModal, setShowPetModal] = useState(false);
  const { auth } = usePage<PageProps>().props;
  
  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    
    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // If it's a different format, try to parse it
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      
      return '';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Prioritize schedule data over appointment data
  const initialDate = formatDateForInput(appointment.schedule?.date || appointment.date);
  const initialTimeId = appointment.schedule?.time_id || appointment.time_id;

  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [filteredTimeslots, setFilteredTimeslots] = useState(timeslots.filter(timeslot => timeslot.is_active));

  // Show only user's pets for non-admin users
  const userPets = is_admin ? pets : pets.filter((pet) => pet.user_id === auth.user.id);
  const [petList, setPetList] = useState(userPets);

  // Debug: Log the received data
  useEffect(() => {
    console.log('Appointment data received:', appointment);
    console.log('Schedule data:', appointment.schedule);
    console.log('Initial date:', initialDate);
    console.log('Initial time ID:', initialTimeId);
  }, [appointment, initialDate, initialTimeId]);

  // In the component, update the initial state to prioritize schedule data
  const { data, setData, put, processing, errors } = useForm({
    user_id: appointment.user_id.toString(),
    pet_id: appointment.pet_id?.toString() || "",
    service_id: appointment.service_id?.toString() || "",
    date: initialDate || "", // Prioritize schedule date
    time_id: initialTimeId?.toString() || "", // Prioritize schedule time_id
    status: appointment.status || "pending",
    notes: appointment.notes || "",
    staff_remarks: appointment.staff_remarks || "",
    payment_status: appointment.payment_status || "unpaid",
  });

  // Filter pets based on selected user (for admin)
  const filteredPets =
    is_admin && data.user_id
      ? petList.filter(p => p.user_id === Number(data.user_id))
      : !is_admin
      ? petList.filter(p => p.user_id === auth.user.id)
      : petList;

  // Handle date change and filter available timeslots
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setData('date', date);
    
    if (date) {
      // Filter active timeslots
      const availableTimeslots = timeslots.filter(timeslot => timeslot.is_active);
      setFilteredTimeslots(availableTimeslots);
    } else {
      setFilteredTimeslots([]);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    // If status is changed to "completed", automatically set payment_status to "paid"
    if (newStatus === 'completed' && data.payment_status !== 'paid') {
      setData({
        ...data,
        status: newStatus,
        payment_status: 'paid'
      });
    } 
    // If status is changed to "cancelled", automatically set payment_status to "unpaid"
    else if (newStatus === 'cancelled') {
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
    // Prevent changing payment status if appointment is cancelled
    if (data.status === 'cancelled') {
      alert('Cannot change payment status for cancelled appointments.');
      return;
    }

    // If status is "completed" and trying to change payment_status away from "paid", show warning
    if (data.status === 'completed' && newPaymentStatus !== 'paid') {
      if (!confirm('Completed appointments must be marked as paid. Do you want to change the status from "completed" first?')) {
        return; // Don't change the payment status
      }
      // If user confirms, change both status and payment status
      setData({
        ...data,
        status: 'confirmed', // Or whatever status you prefer
        payment_status: newPaymentStatus
      });
    } else {
      setData('payment_status', newPaymentStatus);
    }
  };

  const submitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Skip date/timeslot validation for completed appointments
    if (data.status !== 'completed') {
      // Final validation before submission for non-completed appointments
      if (data.status === 'completed' && data.payment_status !== 'paid') {
        alert('Completed appointments must be marked as paid. Please update the payment status.');
        return;
      }

      // Validation for cancelled appointments
      if (data.status === 'cancelled' && data.payment_status !== 'unpaid') {
        alert('Cancelled appointments must be marked as unpaid.');
        return;
      }

      // Validation for date and timeslot (only for non-completed appointments)
      if (!data.date) {
        alert('Please select a date for the appointment.');
        return;
      }

      if (!data.time_id) {
        alert('Please select a timeslot for the appointment.');
        return;
      }
    }
    
    put(route("appointments.update", appointment.id));
  };

  const handlePetAdded = (newPet: any) => {
    if (newPet.user_id === auth.user.id) {
      setPetList((prev) => [...prev, newPet]);
    }
    setShowPetModal(false);
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return 'Invalid Time';
    
    try {
      // Handle ISO datetime strings like "2025-11-14T09:00:00.000000Z"
      if (timeString.includes('T')) {
        // Extract just the time part (HH:MM:SS)
        const timePart = timeString.split('T')[1];
        const timeWithoutMicroseconds = timePart.split('.')[0];
        const [hours, minutes] = timeWithoutMicroseconds.split(':');
        
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        
        if (isNaN(hour) || isNaN(minute)) {
          return 'Invalid Time';
        }
        
        // Convert to 12-hour format
        const period = hour >= 12 ? 'PM' : 'AM';
        const twelveHour = hour % 12 || 12;
        const formattedMinutes = minute.toString().padStart(2, '0');
        
        return `${twelveHour}:${formattedMinutes} ${period}`;
      }
      
      // If it's already just a time string like "09:00:00"
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      
      if (isNaN(hour) || isNaN(minute)) {
        return 'Invalid Time';
      }
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const twelveHour = hour % 12 || 12;
      const formattedMinutes = minute.toString().padStart(2, '0');
      
      return `${twelveHour}:${formattedMinutes} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error, 'Time string:', timeString);
      return 'Invalid Time';
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Auto-fill user_id for non-admin users
  useEffect(() => {
    if (!is_admin) {
      setData('user_id', auth.user.id.toString());
    }
  }, [is_admin, auth.user.id, setData]);

  // Show warning if editing a completed appointment
  const isCompletedAppointment = data.status === 'completed';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Appointment" />

      <motion.div
        className="p-4 md:p-6 flex items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Edit Appointment
            </motion.h1>

            <Link href={route("appointments.index")}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </motion.div>
            </Link>
          </div>

          {/* Completed Appointment Warning */}
          {isCompletedAppointment && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
            >
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Completed Appointment</span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                This appointment is marked as completed. Date and timeslot are no longer required and the schedule has been cleared.
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={submitAppointment} className="space-y-6">
            {/* ADMIN: Select Customer */}
            {is_admin && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="user_id" className="text-gray-700 dark:text-gray-300 font-medium">
                  Customer
                </Label>
                <select
                  id="user_id"
                  value={data.user_id}
                  onChange={(e) => setData({ ...data, user_id: e.target.value, pet_id: '' })}
                  className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
                >
                  <option value="">Select Customer</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
                <InputError message={errors.user_id} className="mt-1" />
              </motion.div>
            )}

            {/* Date & Timeslot - Only show for non-completed appointments */}
            {!isCompletedAppointment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 font-medium">
                    Appointment Date
                    {!data.date && (
                      <span className="text-sm text-red-500 ml-2">(No date set)</span>
                    )}
                  </Label>
                  <Input
                    type="date"
                    id="date"
                    value={data.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={getMinDate()}
                    className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <InputError message={errors.date} className="mt-1" />
                  {/* Debug info */}
                  <p className="text-xs text-gray-500 mt-1">
                    Raw date: {appointment.date} | Schedule date: {appointment.schedule?.date} | Formatted: {data.date}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="time_id" className="text-gray-700 dark:text-gray-300 font-medium">
                    Timeslot
                  </Label>
                  <select
                    id="time_id"
                    value={data.time_id}
                    onChange={(e) => setData("time_id", e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
                    disabled={!data.date}
                  >
                    <option value="">
                      {!data.date ? 'Select Date First' : filteredTimeslots.length === 0 ? 'No available timeslots' : 'Select Timeslot'}
                    </option>
                    {filteredTimeslots.map((timeslot) => (
                      <option key={timeslot.id} value={timeslot.id}>
                        {formatTime(timeslot.start_time)} - {formatTime(timeslot.end_time)}
                        {timeslot.description && ` (${timeslot.description})`}
                      </option>
                    ))}
                  </select>
                  {data.date && filteredTimeslots.length === 0 && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      No available timeslots for the selected date.
                    </p>
                  )}
                  <InputError message={errors.time_id} className="mt-1" />
                </motion.div>
              </div>
            )}

            {/* Show message for completed appointments */}
            {isCompletedAppointment && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
              >
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  <strong>Note:</strong> This completed appointment no longer has an associated schedule. 
                  If you change the status from "completed", you'll need to select a new date and timeslot.
                </p>
              </motion.div>
            )}

            {/* Pet Selection */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <Label htmlFor="pet_id" className="text-gray-700 dark:text-gray-300 font-medium">
                Select Pet
              </Label>
              <div className="flex gap-3 mt-2">
                <select
                  id="pet_id"
                  value={data.pet_id}
                  onChange={(e) => setData("pet_id", e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3"
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
                  {filteredPets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
                {!is_admin && (
                  <Button
                    type="button"
                    onClick={() => setShowPetModal(true)}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    Add Pet
                  </Button>
                )}
              </div>
              {!is_admin && filteredPets.length === 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  You need to add a pet before updating an appointment.
                </p>
              )}
              <InputError message={errors.pet_id} className="mt-1" />
            </motion.div>

            {/* Service Selection */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="service_id" className="text-gray-700 dark:text-gray-300 font-medium">
                Select Service
              </Label>
              <select
                id="service_id"
                value={data.service_id}
                onChange={(e) => setData("service_id", e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
              <InputError message={errors.service_id} className="mt-1" />
            </motion.div>

            {/* Admin Fields */}
            {is_admin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 font-medium">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {data.status === 'completed' && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Payment status automatically set to "paid"
                    </p>
                  )}
                  {data.status === 'cancelled' && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Payment status locked to "unpaid" for cancelled appointments
                    </p>
                  )}
                  <InputError message={errors.status} className="mt-1" />
                </motion.div>

                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <Label htmlFor="payment_status" className="text-gray-700 dark:text-gray-300 font-medium">
                    Payment Status
                  </Label>
                  <select
                    id="payment_status"
                    value={data.payment_status}
                    onChange={(e) => handlePaymentStatusChange(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
                    disabled={data.status === 'completed' || data.status === 'cancelled'}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  {data.status === 'completed' && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Payment status locked to "paid" for completed appointments
                    </p>
                  )}
                  {data.status === 'cancelled' && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Payment status locked to "unpaid" for cancelled appointments
                    </p>
                  )}
                  <InputError message={errors.payment_status} className="mt-1" />
                </motion.div>
              </div>
            )}

            {/* Notes */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300 font-medium">
                Customer Notes
              </Label>
              <textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
                className="w-full h-24 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 mt-2 resize-none"
                placeholder="Any special requests or notes..."
                rows={3}
              />
              <InputError message={errors.notes} className="mt-1" />
            </motion.div>

            {/* Staff Remarks */}
            {is_admin && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <Label htmlFor="staff_remarks" className="text-gray-700 dark:text-gray-300 font-medium">
                  Staff Remarks
                </Label>
                <textarea
                  id="staff_remarks"
                  value={data.staff_remarks}
                  onChange={(e) => setData("staff_remarks", e.target.value)}
                  className="w-full h-24 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 mt-2 resize-none"
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
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={processing || (!is_admin && filteredPets.length === 0)}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Appointment"
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      {/* Pet Modal */}
      <Dialog open={showPetModal} onOpenChange={setShowPetModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Pet</DialogTitle>
          </DialogHeader>
          <PetForm onSuccess={handlePetAdded} onClose={() => setShowPetModal(false)} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}