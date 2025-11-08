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
  status: "pending" | "confirmed" | "completed" | "cancelled";
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
const breadcrumbs: BreadcrumbItem[] = [
  { title: "Appointments", href: "/appointments" },
  { title: "View Appointment", href: "" },
];

/* -------------------------------------------------
   HELPER: Format Date
------------------------------------------------- */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* -------------------------------------------------
   HELPER: Status Badge
------------------------------------------------- */
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

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
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ID: #{appointment.id}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
            </motion.div>

            <Link href={route("appointments.index")}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
              </motion.div>
            </Link>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Pet Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Pet Information
                </h3>
                <div className="bg-gray-50/70 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pet Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {appointment.pet.name}
                  </p>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Service Details
                </h3>
                <div className="bg-gray-50/70 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {appointment.service.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    ₱{appointment.service.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Schedule */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Appointment Schedule
                </h3>
                <div className="bg-gray-50/70 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {formatDate(appointment.appointment_date)}
                  </p>
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Client Information
                </h3>
                <div className="bg-gray-50/70 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {appointment.user.first_name} {appointment.user.last_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white break-all">
                    {appointment.user.email}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <motion.div
            className="flex justify-end mt-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {is_admin && (
              <Link href={route("appointments.edit", appointment.id)}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Appointment
                </motion.button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}