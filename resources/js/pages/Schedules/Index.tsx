    import AppLayout from "@/layouts/app-layout";
    import { type BreadcrumbItem } from "@/types";
    import { Head, Link, router, usePage } from "@inertiajs/react";
    import { route } from "ziggy-js";
    import { motion, AnimatePresence } from "framer-motion";
    import { useState, useMemo } from "react";
    import { can } from "@/lib/can";

    type Schedule = {
    id: number;
    appointment_id: number;
    time_id: number;
    date: string;
    status: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    
    // Joined fields from appointments
    appointment_user_id: number;
    pet_id: number;
    service_id: number;
    appointment_status: "pending" | "confirmed" | "completed" | "cancelled";
    payment_status: "unpaid" | "paid" | "refunded";
    appointment_notes: string | null;
    staff_remarks: string | null;
    
    // Joined fields from users (customer)
    user_first_name: string;
    user_last_name: string;
    
    // Joined fields from pets
    pet_name: string;
    
    // Joined fields from services
    service_name: string;
    service_price: number | string;
    
    // Joined fields from service provider (users table)
    service_provider_first_name: string;
    service_provider_last_name: string;
    
    // Joined fields from time_slots
    start_time: string;
    end_time: string;
    timeslot_description?: string;
    };

    type Props = { schedules: Schedule[] };

    const breadcrumbs: BreadcrumbItem[] = [{ title: "Schedules", href: "/schedules" }];

    // Format time function
    const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    try {
        let timePart = timeString;
        if (timeString.includes('T')) {
        timePart = timeString.split('T')[1].split('.')[0];
        }
        return timePart.substring(0, 5);
    } catch (error) {
        return '--:--';
    }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    };

    // Format price safely
    const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(numPrice);
    };

    export default function Index({ schedules }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

    // Search and sort state
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const openDeleteModal = (schedule: Schedule) => {
        setScheduleToDelete(schedule);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setScheduleToDelete(null);
        setDeletingId(null);
    };

    const confirmDelete = () => {
        if (!scheduleToDelete) return;
        setDeletingId(scheduleToDelete.id);
        router.delete(route("schedules.destroy", scheduleToDelete.id), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => {
            alert("Failed to delete schedule.");
            closeModal();
        },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
        case "scheduled": return "text-blue-600 dark:text-blue-400 font-bold";
        case "confirmed": return "text-green-600 dark:text-green-400 font-bold";
        case "cancelled": return "text-red-600 dark:text-red-400 font-bold";
        case "completed": return "text-purple-600 dark:text-purple-400 font-bold";
        default: return "text-gray-600 dark:text-gray-400 font-bold";
        }
    };

    const getAppointmentStatusColor = (status: string) => {
        switch (status) {
        case "pending": return "text-yellow-600 dark:text-yellow-400 font-bold";
        case "confirmed": return "text-blue-600 dark:text-blue-400 font-bold";
        case "completed": return "text-green-600 dark:text-green-400 font-bold";
        case "cancelled": return "text-red-600 dark:text-red-400 font-bold";
        default: return "text-gray-600 dark:text-gray-400 font-bold";
        }
    };

    // Filter and sort logic - EXCLUDE COMPLETED APPOINTMENTS
    const filteredSchedules = useMemo(() => {
        const term = search.toLowerCase();
        
        // Filter out completed appointments
        const activeSchedules = schedules.filter(
        schedule => schedule.appointment_status !== 'completed'
        );
        
        const filtered = activeSchedules.filter(
        (schedule) =>
            schedule.pet_name.toLowerCase().includes(term) ||
            `${schedule.user_first_name} ${schedule.user_last_name}`.toLowerCase().includes(term) ||
            schedule.service_name.toLowerCase().includes(term) ||
            `${schedule.service_provider_first_name} ${schedule.service_provider_last_name}`.toLowerCase().includes(term) ||
            schedule.timeslot_description?.toLowerCase().includes(term)
        );
        
        return sortOrder === "desc"
        ? [...filtered].sort((a, b) => b.id - a.id)
        : [...filtered].sort((a, b) => a.id - b.id);
    }, [schedules, search, sortOrder]);

    // Stats calculation - EXCLUDE COMPLETED APPOINTMENTS
    const activeSchedules = useMemo(() => {
        return schedules.filter(schedule => schedule.appointment_status !== 'completed');
    }, [schedules]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Schedules" />

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
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                >
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    Delete Schedule
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Permanently delete schedule for{" "}
                    <span className="font-semibold text-red-600">"{scheduleToDelete?.pet_name}"</span>? This action{' '}
                    <span className="underline">cannot be undone</span>.
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
                    {deletingId ? 'Deleting...' : 'Delete Schedule'}
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
            Schedules
            </motion.h1>

            </div>

            {/* Search + Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <input
                type="text"
                placeholder="Search schedules..."
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

            {/* Stats - Only show active schedules */}

            {/* Table Card */}
            <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            >
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                    {['ID', 'Date & Time', 'Customer & Pet', 'Service & Provider', 'Schedule Status', 'Appointment Status'].map((h) => (
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
                    {!filteredSchedules.length ? (
                    <tr>
                        <td colSpan={7} className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center">
                            <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            No active schedules found
                        </div>
                        </td>
                    </tr>
                    ) : (
                    filteredSchedules.map((schedule, index) => (
                        <motion.tr
                        key={schedule.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                        >
                        {/* ID */}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white align-middle">
                            #{schedule.id}
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4 align-middle">
                            <div className="font-medium text-gray-900 dark:text-white">
                            {formatDate(schedule.date)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                            </div>
                            {schedule.timeslot_description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {schedule.timeslot_description}
                            </div>
                            )}
                        </td>

                        {/* Customer & Pet */}
                        <td className="px-6 py-4 align-middle">
                            <div className="font-medium text-gray-900 dark:text-white">
                            {schedule.user_first_name} {schedule.user_last_name}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                            {schedule.pet_name}
                            </div>
                        </td>

                        {/* Service & Provider */}
                        <td className="px-6 py-4 align-middle">
                            <div className="font-medium text-gray-900 dark:text-white">
                            {schedule.service_name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatPrice(schedule.service_price)}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">
                            {schedule.service_provider_first_name} {schedule.service_provider_last_name}
                            </div>
                        </td>

                        {/* Schedule Status */}
                        <td className="px-6 py-4 align-middle">
                            <div className="flex flex-col items-start space-y-1">
                            <span className={`text-sm ${getStatusColor(schedule.status)}`}>
                                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                            </span>
                            </div>
                        </td>

                        {/* Appointment Status */}
                        <td className="px-6 py-4 align-middle">
                            <div className="flex flex-col items-start space-y-1">
                            <span className={`text-sm ${getAppointmentStatusColor(schedule.appointment_status)}`}>
                                {schedule.appointment_status.charAt(0).toUpperCase() + schedule.appointment_status.slice(1)}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {schedule.payment_status}
                            </div>
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