import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  is_active: boolean;
};

type Props = {
  users: User[];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Users', href: '/users' },
];

export default function Index({ users }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold text-gray-800">User List</h1>
          <Link href={route('user.create')}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition"
            >
              + Create User
            </motion.button>
          </Link>
        </motion.div>

        {/* Table */}
        <motion.div
          className="overflow-x-auto rounded-2xl shadow-md bg-white border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                {['ID', 'Name', 'Surname', 'Email', 'Address', 'Phone', 'Status'].map(
                  (header) => (
                    <th
                      key={header}
                      className="text-left px-6 py-3 text-gray-700 text-sm font-semibold"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-6 py-3 border-t text-gray-800">{user.id}</td>
                  <td className="px-6 py-3 border-t text-gray-700">{user.first_name}</td>
                  <td className="px-6 py-3 border-t text-gray-700">{user.last_name}</td>
                  <td className="px-6 py-3 border-t text-gray-700">{user.email}</td>
                  <td className="px-6 py-3 border-t text-gray-700">{user.address}</td>
                  <td className="px-6 py-3 border-t text-gray-700">{user.phone}</td>
                  <td className="px-6 py-3 border-t text-center">
                    <motion.span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm ${
                        user.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
