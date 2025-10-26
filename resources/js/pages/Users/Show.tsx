import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'User Show', href: '/users' },
];

export default function Show({ user }: { user: any }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Details" />

      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            User Details
          </h1>

          <Link
            href={route('users.index')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition"
          >
            ← Back
          </Link>
        </div>

        {/* User Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-3">
          <p>
            <strong className="text-gray-700">Name:</strong>{' '}
            <span className="text-gray-900">{user.name}</span>
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong>{' '}
            <span className="text-gray-900">{user.email}</span>
          </p>
          {user.phone && (
            <p>
              <strong className="text-gray-700">Phone:</strong>{' '}
              <span className="text-gray-900">{user.phone}</span>
            </p>
          )}
          {user.address && (
            <p>
              <strong className="text-gray-700">Address:</strong>{' '}
              <span className="text-gray-900">{user.address}</span>
            </p>
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}
