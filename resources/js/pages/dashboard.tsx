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
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

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
  typeCounts = {},
  dailyRegistrations = {},
  monthlyUsers = {},
}: DashboardProps) {
  // === PIE CHART ===
  const pieData = {
    labels: Object.keys(typeCounts),
    datasets: [{
      data: Object.values(typeCounts),
      backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };
  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' as const }, title: { display: true, text: 'User Types' } },
  };

  // === LINE CHART ===
  const lineLabels = Object.keys(dailyRegistrations).sort();
  const lineData = {
    labels: lineLabels.length ? lineLabels : ['No Data'],
    datasets: [{
      label: 'New Users',
      data: lineLabels.length ? lineLabels.map(d => dailyRegistrations[d]) : [0],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
    }],
  };
  const lineOptions = {
    responsive: true,
    plugins: { title: { display: true, text: 'Daily Signups (Last 30 Days)' } },
    scales: { y: { beginAtZero: true } },
  };

  // === BAR CHART ===
  const barData = {
    labels: Object.keys(monthlyUsers),
    datasets: [{
      label: 'New Users',
      data: Object.values(monthlyUsers),
      backgroundColor: '#8B5CF6',
      borderRadius: 6,
    }],
  };
  const barOptions = {
    responsive: true,
    plugins: { title: { display: true, text: 'Monthly Growth (Last 6 Months)' } },
    scales: { y: { beginAtZero: true } },
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
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Total Users', value: totalUsers, icon: '👥', color: 'bg-blue-500' },
            { label: 'New (30d)', value: newRegistrations, icon: '📈', color: 'bg-green-500' },
            { label: 'Active Users', value: activeUsers, icon: '✅', color: 'bg-purple-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 flex items-center space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* === CHARTS === */}
        <div className="grid gap-6 lg:grid-cols-2">
  <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 flex justify-center">
    <div className="w-full max-w-[400px] h-[250px]">
      <Pie data={pieData} options={pieOptions} />
    </div>
  </motion.div>

  <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 flex justify-center">
    <div className="w-full max-w-[500px] h-[250px]">
      <Line data={lineData} options={lineOptions} />
    </div>
  </motion.div>
</div>

<motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 flex justify-center">
  <div className="w-full max-w-[600px] h-[300px]">
    <Bar data={barData} options={barOptions} />
  </div>
</motion.div>


        {/* === RECENT USERS === */}
        <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Sign-ups</h3>
            {recentUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No recent users</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {['Name', 'Email', 'Phone', 'Type', 'Joined'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm font-medium">{u.first_name} {u.last_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{u.phone || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                            u.user_type === 'admin' ? 'bg-red-100 text-red-800' :
                            u.user_type === 'vet' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {u.user_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{u.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}