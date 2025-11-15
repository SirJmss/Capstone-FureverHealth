'use client';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Calendar, Clock, User, Package, Shield, Edit, ChevronLeft } from 'lucide-react';

/* -------------------------------------------------
   TYPES
------------------------------------------------- */
interface ServiceUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface ServiceProps {
  id: number;
  name: string;
  price: number;
  user: ServiceUser;
}

interface AppointmentProps {
  id: number;
  appointment_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  pet: { id: number; name: string };
  service: ServiceProps;
  user: { id: number; first_name: string; last_name: string; email: string };
}

interface PageProps extends InertiaPageProps {
  appointment: AppointmentProps;
  is_admin: boolean;
}

/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs = (petName: string): BreadcrumbItem[] => [
  { title: 'Appointments', href: '/appointments' },
  { title: petName, href: '' },
];

/* -------------------------------------------------
   HELPERS
------------------------------------------------- */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
  }
};

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function ShowAppointment() {
  const { appointment, is_admin } = usePage<PageProps>().props;

  // Defensive: if appointment is missing
  if (!appointment) {
    return (
      <AppLayout breadcrumbs={[{ title: 'Appointments', href: '/appointments' }]}>
        <Head title="Appointment – Not Found" />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Appointment Not Found
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              The appointment data is missing.
            </p>
            <Link href={route('appointments.index')}>
              <button className="mt-4 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
                Back to Appointments
              </button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const petName = appointment.pet.name;
  const clientName = `${appointment.user.first_name} ${appointment.user.last_name}`;
  const providerName = `${appointment.service.user.first_name} ${appointment.service.user.last_name}`;

  return (
    <AppLayout breadcrumbs={breadcrumbs(petName)}>
      <Head title={`Appointment – ${petName}`} />

      

      <motion.div
        className="flex min-h-[80vh] items-center justify-center p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-4xl rounded-2xl bg-white/80 dark:bg-gray-800/80 p-8 shadow-2xl backdrop-blur-xl md:p-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                Appointment Details
              </h1>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ID: #{appointment.id}
                </span>
                <motion.span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </motion.span>
              </div>
            </motion.div>

            <Link href={route('appointments.index')}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Appointments
              </motion.div>
            </Link>
          </div>

          {/* Info Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left: Pet + Service */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Pet */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-md">
                  <span className="text-lg">Paw</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pet</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{appointment.pet.name}</p>
                </div>
              </div>

              {/* Service */}
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Service</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{appointment.service.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ₱{appointment.service.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Service Provider */}
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Provider</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{providerName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.service.user.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Schedule + Client */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Schedule */}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(appointment.appointment_date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Client */}
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Client</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{clientName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 break-all">{appointment.user.email}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {is_admin && (
              <Link href={route('appointments.edit', appointment.id)}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl border border-blue-300 px-6 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
                >
                  <Edit className="h-4 w-4" />
                  Edit Appointment
                </motion.div>
              </Link>
            )}

            <Link href={route('appointments.index')}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-xl border border-blue-300 px-6 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                View All Appointments
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}