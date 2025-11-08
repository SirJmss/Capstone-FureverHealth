import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { motion } from "framer-motion";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

/* -------------------------------------------------
   TYPES
------------------------------------------------- */
interface AppointmentProps {
  id: number;
  appointment_date: string;
  status: string;
  pet: { id: number; name: string };
  service: { id: number; name: string; price: number };
  user: { id: number; first_name: string; last_name: string; email: string };
}

interface PageProps extends InertiaPageProps {
  appointment: AppointmentProps;
  is_admin: boolean;
}
/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs: BreadcrumbItem[] = [{ title: "Appointments", href: "/appointments" }];

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function ShowAppointment() {
  const { appointment, is_admin } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Appointment #${appointment.id}`} />

      <motion.div
        className="p-4 md:p-6 flex items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Appointment Details
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ID: #{appointment.id} • {appointment.status}
              </p>
            </motion.div>

            <Link href={route("appointments.index")}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Appointments
              </motion.div>
            </Link>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left: Pet + Service */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Pet Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500">Pet Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{appointment.pet.name}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Service Details
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {appointment.service.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ₱{appointment.service.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: User + Schedule */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Appointment Schedule
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500">Schedule Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {appointment.appointment_date}
                  </p>

                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Client Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {appointment.user.first_name} {appointment.user.last_name}
                  </p>

                  <p className="text-sm text-gray-500 mt-3">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {appointment.user.email}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-10">
            {is_admin && (
              <Link
                href={route("appointments.edit", appointment.id)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                Edit Appointment
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
