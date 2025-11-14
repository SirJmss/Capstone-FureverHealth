import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Pet {
    id: number;
    name: string;
}

interface Service {
    id: number;
    name: string;
    price: number;
}

interface TimeSlot {
    id: number;
    start_time: string;
    end_time: string;
}

interface Schedule {
    id: number;
    appointment_id: number;
    time_id: number;
    date: string;
    status: string;
    notes?: string;
    timeslot: TimeSlot;
}

interface Appointment {
    id: number;
    user_id: number;
    pet_id: number;
    service_id: number;
    status: string;
    payment_status: string;
    notes?: string;
    staff_remarks?: string;
    user: User;
    pet: Pet;
    service: Service;
    schedule?: Schedule;
    created_at: string;
    updated_at: string;
}

interface HistoryProps {
    appointments: {
        data: Appointment[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    is_admin: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'History', href: '/history' },
    { title: 'Completed Appointments', href: '' },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatTime = (timeString: string) => {
    if (!timeString) return 'Invalid Time';
    
    try {
        if (timeString.includes('T')) {
            const timePart = timeString.split('T')[1];
            const timeWithoutMicroseconds = timePart.split('.')[0];
            const [hours, minutes] = timeWithoutMicroseconds.split(':');
            
            const hour = parseInt(hours, 10);
            const minute = parseInt(minutes, 10);
            
            const period = hour >= 12 ? 'PM' : 'AM';
            const twelveHour = hour % 12 || 12;
            const formattedMinutes = minute.toString().padStart(2, '0');
            
            return `${twelveHour}:${formattedMinutes} ${period}`;
        }
        
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const twelveHour = hour % 12 || 12;
        const formattedMinutes = minute.toString().padStart(2, '0');
        
        return `${twelveHour}:${formattedMinutes} ${period}`;
    } catch (error) {
        return 'Invalid Time';
    }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
};

const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
        case 'completed':
            return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
        default:
            return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`;
    }
};

const getPaymentStatusBadge = (paymentStatus: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (paymentStatus) {
        case 'paid':
            return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
        case 'unpaid':
            return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`;
        case 'refunded':
            return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100`;
        default:
            return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`;
    }
};

export default function HistoryIndex({ appointments, is_admin }: HistoryProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointment History" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Appointment History
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    View your completed service history and download receipts
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Completed: {appointments.data.length}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={route('appointments.index')}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
                                >
                                    Back to Appointments
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Appointments Table */}
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {appointments.data.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No completed appointments</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    {is_admin 
                                        ? "There are no completed appointments in the system yet."
                                        : "You don't have any completed appointments yet."
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            {is_admin && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Client
                                                </th>
                                            )}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Pet & Service
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Payment
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {appointments.data.map((appointment, index) => (
                                            <motion.tr
                                                key={appointment.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                {is_admin && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {appointment.user.first_name} {appointment.user.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {appointment.user.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {appointment.pet.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {appointment.service.name}
                                                        </div>
                                                        {appointment.notes && (
                                                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                                Note: {appointment.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {appointment.schedule ? (
                                                        <>
                                                            <div className="text-sm text-gray-900 dark:text-white">
                                                                {formatDate(appointment.schedule.date)}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {formatTime(appointment.schedule.timeslot.start_time)} - {formatTime(appointment.schedule.timeslot.end_time)}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            Completed appointment
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                        {formatCurrency(appointment.service.price)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={getPaymentStatusBadge(appointment.payment_status)}>
                                                        {appointment.payment_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <a 
                                                            href={route('appointments.receipt', appointment.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Download PDF
                                                        </a>
                                                        <Link
                                                            href={route('appointments.receipt.view', appointment.id)}
                                                            target="_blank"
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            View Receipt
                                                        </Link>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {appointments.data.length > 0 && (
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing page {appointments.current_page} of {appointments.last_page}
                                    </div>
                                    <div className="flex space-x-2">
                                        {appointments.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}