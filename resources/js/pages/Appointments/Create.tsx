import { useState, useEffect } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PetForm from "@/components/PetForm";
import { motion } from 'framer-motion';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

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
  const [selectedDate, setSelectedDate] = useState('');
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



  // Non-admin: auto-fill user_id
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
      // Normalize the date format to ensure matching
      const normalizedDate = data.date;
      
      console.log(`Filtering schedules for date: ${normalizedDate}`);
      
      const bookedForDate = existing_schedules
        .filter(schedule => {
          // Handle both date formats - ensure they match
          const scheduleDate = schedule.date.split(' ')[0]; // Remove time part if exists
          const scheduleDateNormalized = new Date(scheduleDate).toISOString().split('T')[0];
          const matches = scheduleDateNormalized === normalizedDate;
          
          if (matches) {
            console.log(`Found booked timeslot: ${schedule.time_id} for date ${scheduleDate}`);
          }
          
          return matches;
        })
        .map(schedule => schedule.time_id);
      
      console.log(`Final booked time slots for ${normalizedDate}:`, bookedForDate);
      setBookedTimeSlots(new Set(bookedForDate));
    } else {
      setBookedTimeSlots(new Set());
    }
  }, [data.date, existing_schedules]);

  // Handle date change and filter available timeslots
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setData('date', date);
    setData('time_id', '');

    if (date) {
      // Filter active timeslots
      const availableTimeslots = timeslots.filter(timeslot => timeslot.is_active);
      setFilteredTimeslots(availableTimeslots);
    } else {
      setFilteredTimeslots([]);
    }
  };

  // Check if a timeslot is available
  const isTimeslotAvailable = (timeslotId: number) => {
    if (!data.date) return true;
    const isAvailable = !bookedTimeSlots.has(timeslotId);
    console.log(`Timeslot ${timeslotId} available: ${isAvailable}`);
    return isAvailable;
  };

  // Get available timeslots count
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
    
    // Frontend validation for double booking
    if (data.date && data.time_id && !isTimeslotAvailable(Number(data.time_id))) {
      alert('This timeslot is already booked. Please select a different timeslot.');
      return;
    }

    // Validation for date and timeslot
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Appointment" />

      <motion.div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div
          className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Appointment
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Schedule a pet service</p>
            </div>
            <Link href={route('appointments.index')}>
              <Button variant="outline">Back</Button>
            </Link>
          </div>

         
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ADMIN: Select Customer */}
            {is_admin && (
              <div>
                <Label htmlFor="user_id">Customer *</Label>
                <select
                  id="user_id"
                  value={data.user_id}
                  onChange={(e) =>
                    setData({ ...data, user_id: e.target.value, pet_id: '' })
                  }
                  className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
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

            {/* Pet & Service */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pet_id">Pet *</Label>
                <div className="flex gap-3 mt-2">
                  <select
                    id="pet_id"
                    value={data.pet_id}
                    onChange={(e) => setData('pet_id', e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
                    required
                    disabled={is_admin && !data.user_id}
                  >
                    <option value="">
                      {is_admin
                        ? data.user_id
                          ? 'Select Pet'
                          : 'Select Customer First'
                        : petList.length === 0
                        ? 'No pets available'
                        : 'Select Pet'}
                    </option>
                    {filteredPets.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!is_admin && filteredPets.length === 0 && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                    You need to add a pet before creating an appointment.
                  </p>
                )}
                <InputError message={errors.pet_id} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="service_id">Service *</Label>
                <select
                  id="service_id"
                  value={data.service_id}
                  onChange={(e) => setData('service_id', e.target.value)}
                  className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
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
            </div>

            {/* Date & Timeslot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Appointment Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={data.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={getMinDate()}
                  className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
                  required
                />
                <InputError message={errors.date} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="time_id">Timeslot *</Label>
                <select
                  id="time_id" 
                  value={data.time_id} 
                  onChange={(e) => setData('time_id', e.target.value)}  
                  className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
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
                        className={!isAvailable ? 'text-gray-400 bg-gray-100 dark:bg-gray-600 line-through' : ''}
                      >
                        {formatTime(timeslot.start_time)} - {formatTime(timeslot.end_time)}
                        {timeslot.description && ` (${timeslot.description})`}
                        {!isAvailable && ' - BOOKED'}
                      </option>
                    );
                  })}
                </select>
                {data.date && (
                  <div className="mt-1">
                    {availableTimeslotsCount === 0 ? (
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    All timeslots are booked for this date. Please select a different date.
                      </p>
                    ) : (
                      <p className="text-sm text-green-600 dark:text-green-400">
                      {availableTimeslotsCount} timeslot{availableTimeslotsCount !== 1 ? 's' : ''} available
                        {bookedTimeSlots.size > 0 && ` • ${bookedTimeSlots.size} booked`}
                      </p>
                    )}
                  </div>
                )}
                <InputError message={errors.time_id} className="mt-1" />
              </div>
            </div>

            {/* Status & Payment (Admin Only) */}
            {is_admin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
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
                </div>

                <div>
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <select
                    id="payment_status"
                    value={data.payment_status}
                    onChange={(e) => handlePaymentStatusChange(e.target.value)}
                    className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
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
                </div>
              </div>
            )}

            {/* Staff Remarks */}
            {is_admin && (
              <div>
                <Label htmlFor="staff_remarks">Staff Remarks</Label>
                <Input
                  id="staff_remarks"
                  type="text"
                  value={data.staff_remarks}
                  onChange={(e) => setData('staff_remarks', e.target.value)}
                  placeholder="Internal notes..."
                  className="mt-2 h-12"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes">
                {is_admin ? 'Customer Notes (Optional)' : 'Notes (Optional)'}
              </Label>
              <textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                placeholder={is_admin
                  ? "Customer's special requests..."
                  : "Any special requests..."}
                className="w-full h-24 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 resize-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={processing || (!is_admin && filteredPets.length === 0) || (!!data.date && availableTimeslotsCount === 0)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {processing ? 'Creating...' : 'Create Appointment'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>

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