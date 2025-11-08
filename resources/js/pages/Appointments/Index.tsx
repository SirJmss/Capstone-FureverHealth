import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { can } from "@/lib/can";

type User = { id: number; first_name: string; last_name: string };
type Pet = { id: number; name: string };
type Service = { id: number; name: string; price: number };
type Appointment = {
  id: number;
  user_id: number;
  pet_id: number;
  service_id: number;
  appointment_date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  payment_status: "unpaid" | "paid" | "refunded";
  notes: string | null;
  staff_remarks: string | null;
  service_fee: number | null;
  user: User;
  pet: Pet;
  service: Service;
};

type Props = { appointments: Appointment[] };

const breadcrumbs: BreadcrumbItem[] = [{ title: "Appointments", href: "/appointments" }];

export default function Index({ appointments }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  // New state: search + sort
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // default: newest first

  const openDeleteModal = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAppointmentToDelete(null);
    setDeletingId(null);
  };

  const confirmDelete = () => {
    if (!appointmentToDelete) return;
    setDeletingId(appointmentToDelete.id);
    router.delete(route("appointments.destroy", appointmentToDelete.id), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        alert("Failed to delete appointment.");
        closeModal();
      },
    });
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "unpaid":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Filter + Sort logic
  const filteredAppointments = useMemo(() => {
  const term = search.toLowerCase();
  const filtered = appointments.filter(
    (a) =>
      a.pet.name.toLowerCase().includes(term) ||
      `${a.user.first_name} ${a.user.last_name}`.toLowerCase().includes(term)
  );
  return sortOrder === "desc"
    ? [...filtered].sort((a, b) => b.id - a.id)
    : [...filtered].sort((a, b) => a.id - b.id);
}, [appointments, search, sortOrder]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Appointments" />

      {/* === DELETE MODAL === */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 shadow-2xl border border-white/20"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                Delete Appointment
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Permanently delete appointment for{" "}
                <span className="font-semibold text-red-600">
                  {appointmentToDelete?.pet.name}
                </span>{" "}
                ({appointmentToDelete?.user.first_name} {appointmentToDelete?.user.last_name})?
                This action <span className="underline">cannot be undone</span>.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={deletingId !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm shadow-lg transition hover:from-red-600 hover:to-red-700 disabled:opacity-50"
                >
                  {deletingId ? "Deleting..." : "Delete Appointment"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MAIN CONTENT === */}
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Appointments
          </motion.h1>

          {can("appointments.create") && (
            <Link href={route("appointments.create")}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Appointment
              </motion.button>
            </Link>
          )}
        </div>

        {/* Search + Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm transition hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Sort: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </button>
        </div>

        {/* Table */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                  {["ID", "Customer", "Pet", "Service", "Appointment Date", "Status", "Payment", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!filteredAppointments.length ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-500 dark:text-gray-400">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment, index) => (
                    <motion.tr
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{appointment.id}</td>
                      <td className="px-6 py-4">
                        {appointment.user.first_name} {appointment.user.last_name}
                      </td>
                      <td className="px-6 py-4 text-blue-700 dark:text-blue-300">{appointment.pet.name}</td>
                      <td className="px-6 py-4">
                        {appointment.service.name} <br />
                        <span className="text-xs text-gray-500 dark:text-gray-400">${appointment.service.price}</span>
                      </td>
                      <td className="px-6 py-4">{formatDate(appointment.appointment_date)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(appointment.payment_status)}`}
                        >
                          {appointment.payment_status}
                        </span>
                      </td>
                       {/* Actions (UNCHANGED) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {can("appointments.view") && (
                          <Link href={route("appointments.show", appointment.id)}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                              title="View"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </motion.button>
                          </Link>
                        )}

                        {can("appointments.edit") && (
                          <Link href={route("appointments.edit", appointment.id)}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </motion.button>
                          </Link>
                        )}

                        {can("appointments.delete") && (
                          <motion.button
                            onClick={() => openDeleteModal(appointment)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </motion.button>
                        )}
                      </div>
                    </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
