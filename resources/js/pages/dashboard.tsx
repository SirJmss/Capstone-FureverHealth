import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Users, Calendar, Clock, Scissors, TrendingUp, Activity, CheckCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
];

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  category_id: number;
  is_active: number;
}

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  max_appointments: number;
  is_active: number;
  description: string;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  pet: { name: string };
  service: { name: string };
}

interface DashboardProps {
  totalUsers: number;
  newRegistrations: number;
  activeUsers: number;
  recentUsers: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    user_type: string;
    created_at: string;
  }>;
  services: Service[];
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  dailyRegistrations: Record<string, number>;
  monthlyUsers: Record<string, number>;
  serviceUsage: Record<string, number>;
}

export default function Dashboard({
  totalUsers = 0,
  newRegistrations = 0,
  activeUsers = 0,
  recentUsers = [],
  services = [],
  timeSlots = [],
  appointments = [],
  dailyRegistrations = {},
  monthlyUsers = {},
  serviceUsage = {},
}: DashboardProps) {
  // === LINE CHART (Daily Signups) ===
  const lineLabels = Object.keys(dailyRegistrations).sort();
  const lineData = {
    labels: lineLabels.length ? lineLabels : ['No Data'],
    datasets: [
      {
        label: 'New Users',
        data: lineLabels.length ? lineLabels.map(d => dailyRegistrations[d]) : [0],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#10B981',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Daily Signups (Last 30 Days)',
        font: { size: 16 } as const,
        color: '#111827',
      },
      legend: { position: 'top' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { precision: 0 },
      },
      x: { grid: { display: false } },
    },
  };

  // === BAR CHART (Monthly Users) ===
  const barData = {
    labels: Object.keys(monthlyUsers),
    datasets: [
      {
        label: 'New Users',
        data: Object.values(monthlyUsers),
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Growth (Last 6 Months)',
        font: { size: 16 } as const,
        color: '#111827',
      },
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { precision: 0 },
      },
      x: { grid: { display: false } },
    },
  };

  // === DOUGHNUT CHART (Service Usage) ===
  const serviceLabels = Object.keys(serviceUsage);
  const doughnutData = {
    labels: serviceLabels.length ? serviceLabels : ['No Data'],
    datasets: [
      {
        data: serviceLabels.length ? serviceLabels.map(s => serviceUsage[s]) : [1],
        backgroundColor: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Top Services Booked',
        font: { size: 16 } as const,
        color: '#111827',
      },
      legend: { position: 'right' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-teal-600" />
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time insights into users, services, and appointments
          </p>
        </motion.div>

        {/* === STATS CARDS === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-600' },
            { label: 'New (30d)', value: newRegistrations, icon: TrendingUp, color: 'bg-emerald-600' },
            { label: 'Active Services', value: services.filter(s => s.is_active).length, icon: Scissors, color: 'bg-amber-600' },
            { label: 'Time Slots', value: timeSlots.filter(t => t.is_active).length, icon: Clock, color: 'bg-purple-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* === CHARTS GRID === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Daily Signups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Daily Signups
            </h3>
            <div className="h-64">
              <Line data={lineData} options={lineOptions} />
            </div>
          </motion.div>

          {/* Service Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-amber-600" />
              Top Services
            </h3>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Monthly Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Monthly Growth
            </h3>
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </motion.div>
        </div>

        {/* === TABLES GRID === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Recent Users
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {recentUsers.length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No users</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      {['Name', 'Email', 'Type', 'Joined'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentUsers.slice(0, 5).map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                              {u.first_name[0]}{u.last_name[0]}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {u.first_name} {u.last_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {u.user_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(u.created_at), 'MMM d')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

          {/* Active Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-600" />
                Active Services
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {services.filter(s => s.is_active).length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No active services</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      {['Service', 'Price', 'Duration', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {services.filter(s => s.is_active).slice(0, 5).map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {s.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          ₱{s.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {s.duration} min
                        </td>
                        <td className="px-4 py-3">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

        </div>

        {/* === TIME SLOTS & APPOINTMENTS === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Time Slots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Time Slots
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {timeSlots.filter(t => t.is_active).length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No time slots</p>
              ) : (
                <div className="p-4 space-y-2">
                  {timeSlots.filter(t => t.is_active).slice(0, 6).map(slot => (
                    <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {slot.start_time} – {slot.end_time}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{slot.description}</p>
                      </div>
                      <span className="text-xs font-medium text-purple-600">
                        Max: {slot.max_appointments}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Recent Appointments
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {appointments.length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No appointments</p>
              ) : (
                <div className="p-4 space-y-2">
                  {appointments.slice(0, 5).map(appt => (
                    <div key={appt.id} className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {appt.pet.name} • {appt.service.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {format(new Date(appt.date), 'MMM d')} at {appt.time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                          appt.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </AppLayout>
  );
}