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
import { Line, Bar } from 'react-chartjs-2';

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

type DashboardProps = {
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
  typeCounts: Record<string, number>;
  dailyRegistrations: Record<string, number>;
  monthlyUsers: Record<string, number>;
};

export default function Dashboard({
  totalUsers = 0,
  newRegistrations = 0,
  activeUsers = 0,
  recentUsers = [],
  dailyRegistrations = {},
  monthlyUsers = {},
}: DashboardProps) {
  // === LINE CHART DATA ===
  const lineLabels = Object.keys(dailyRegistrations).sort();
  const lineData = {
    labels: lineLabels.length ? lineLabels : ['No Data'],
    datasets: [
      {
        label: 'New Users',
        data: lineLabels.length ? lineLabels.map((d) => dailyRegistrations[d]) : [0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ],
  };

  // === LINE CHART OPTIONS (FIXED) ===
  const lineOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Daily Signups (Last 30 Days)',
        font: { size: 16, weight: 'bold' as const },
        color: '#1F2937',
      },
      legend: { position: 'top' as const },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  // === BAR CHART DATA ===
  const barData = {
    labels: Object.keys(monthlyUsers),
    datasets: [
      {
        label: 'New Users',
        data: Object.values(monthlyUsers),
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // === BAR CHART OPTIONS (FIXED) ===
  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Growth (Last 6 Months)',
        font: { size: 16, weight: 'bold' as const },
        color: '#1F2937',
      },
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <motion.div
        className="p-4 md:p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* === STATS CARDS === */}
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { label: 'Total Users', value: totalUsers, icon: 'Users', color: 'from-blue-500 to-blue-600' },
            { label: 'New (30d)', value: newRegistrations, icon: 'Trending Up', color: 'from-green-500 to-emerald-600' },
            { label: 'Active Users', value: activeUsers, icon: 'Check Circle', color: 'from-purple-500 to-purple-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border border-white/20 p-6 transition-all hover:shadow-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                  {stat.icon === 'Users' && (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H9a2 2 0 01-2-2v-1a6 6 0 0112 0v1a2 2 0 01-2 2zm-3-1h.01" />
                    </svg>
                  )}
                  {stat.icon === 'Trending Up' && (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {stat.icon === 'Check Circle' && (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* === CHARTS GRID === */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Line Chart */}
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Daily Signups</h3>
            <div className="h-64">
              <Line data={lineData} options={lineOptions} />
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Growth</h3>
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </motion.div>
        </div>

        {/* === RECENT USERS === */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Sign-ups</h3>
          </div>
          <div className="overflow-x-auto">
            {recentUsers.length === 0 ? (
              <div className="text-center py-16">
                <svg className="mx-auto w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 01-2 2H5a2 2 0 01-2-2 2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No recent users</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                    {['Name', 'Email', 'Phone', 'Joined'].map((h, i) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentUsers.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {u.first_name[0]}{u.last_name[0]}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {u.first_name} {u.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{u.phone || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}