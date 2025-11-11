import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

type User = { id: number; first_name: string; last_name: string };
type Pet = { id: number; name: string; user_id: number };
type Service = { id: number; name: string; price: number };

interface CreateProps {
  users?: User[];
  pets: Pet[];
  services: Service[];
  is_admin: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Appointments', href: '/appointments' },
  { title: 'Create Appointment', href: '/appointments/create' },
];

export default function Create({ users = [], pets, services, is_admin }: CreateProps) {
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

  // Non-admin: auto-fill user_id from first pet
  const currentUserId = !is_admin && pets.length > 0 ? pets[0].user_id.toString() : '';
  const filteredPets = is_admin && data.user_id
    ? pets.filter(p => p.user_id === Number(data.user_id))
    : pets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!is_admin && currentUserId) {
      setData('user_id', currentUserId);
    }

    post(route('appointments.store'));
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ADMIN: Select Customer - HIDDEN FOR CUSTOMERS */}
            {is_admin && (
              <div>
                <Label htmlFor="user_id">Customer *</Label>
                <select
                  id="user_id"
                  value={data.user_id}
                  onChange={(e) => setData({ ...data, user_id: e.target.value, pet_id: '' })}
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
                <select
                  id="pet_id"
                  value={data.pet_id}
                  onChange={(e) => setData('pet_id', e.target.value)}
                  className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
                  required
                  disabled={is_admin && !data.user_id}
                >
                  <option value="">
                    {is_admin
                      ? data.user_id ? 'Select Pet' : 'Select Customer First'
                      : pets.length === 0 ? 'No pets available' : 'Select Pet'}
                  </option>
                  {filteredPets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {!is_admin && pets.length === 0 && (
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

            {/* Date & Time - VISIBLE TO ALL */}
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

            {/* Status & Payment - HIDDEN FOR CUSTOMERS */}
            {is_admin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <select
                    id="payment_status"
                    value={data.payment_status}
                    onChange={(e) => setData('payment_status', e.target.value)}
                    className="w-full h-12 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            )}

            {/* Staff Remarks (Admin Only) - HIDDEN FOR CUSTOMERS */}
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

            {/* Notes - VISIBLE TO ALL */}
            <div>
              <Label htmlFor="notes">
                {is_admin ? 'Customer Notes (Optional)' : 'Notes (Optional)'}
              </Label>
              <textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                placeholder={is_admin ? "Customer's special requests..." : "Any special requests..."}
                className="w-full h-24 mt-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 resize-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={processing || (!is_admin && pets.length === 0)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {processing ? 'Creating...' : 'Create Appointment'}
              </Button>
            </div>

            {/* Info message for customers */}
            
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}