import { useState } from "react";
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

interface CreateProps {
  users?: User[];
  pets: Pet[];
  services: Service[];
  is_admin: boolean;
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

export default function Create({ users = [], pets, services, is_admin }: CreateProps) {
  const { auth } = usePage<PageProps>().props;
  const [showPetModal, setShowPetModal] = useState(false);
  const [petList, setPetList] = useState(pets);

  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    pet_id: '',
    service_id: '',
    appointment_date: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (data.status === 'completed' && data.payment_status !== 'paid') {
      alert('Completed appointments must be marked as paid. Please update the payment status.');
      return;
    }

    // Validation for cancelled appointments
    if (data.status === 'cancelled' && data.payment_status !== 'unpaid') {
      alert('Cancelled appointments must be marked as unpaid.');
      return;
    }
    
    if (!is_admin && currentUserId) setData('user_id', currentUserId);
    post(route('appointments.store'));
  };

  const handlePetAdded = (newPet: Pet) => {
    setPetList(prev => [...prev, newPet]);
    setShowPetModal(false);
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

            {/* Date & Time */}
            <div>
              <Label htmlFor="appointment_date">Date & Time *</Label>
              <Input
                id="appointment_date"
                type="datetime-local"
                value={data.appointment_date}
                onChange={(e) => setData('appointment_date', e.target.value)}
                className="mt-2 h-12"
                required
              />
              <InputError message={errors.appointment_date} className="mt-1" />
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
                disabled={processing || (!is_admin && filteredPets.length === 0)}
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