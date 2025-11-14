import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import {
  User, Mail, Phone, MapPin, Shield, ChevronLeft, CheckCircle
} from 'lucide-react';

/* -------------------------------------------------
   COLOR PALETTE + HASH FUNCTION (unchanged)
------------------------------------------------- */
const colors = [
  'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
  'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
  'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
] as const;

const getColorClass = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};

/* -------------------------------------------------
   PERMISSION DESCRIPTIONS (unchanged)
------------------------------------------------- */
const permissionDescriptions: Record<string, string> = {
  'user.view': 'Can view user profiles and lists.',
  'user.create': 'Can create new users in the system.',
  'user.edit': 'Can modify existing user information.',
  'user.delete': 'Can remove user accounts permanently.',
  'roles.view': 'Can view all roles and their permissions.',
  'roles.create': 'Can create new roles.',
  'roles.edit': 'Can modify existing roles and permissions.',
  'roles.delete': 'Can delete roles.',
};

/* -------------------------------------------------
   TYPES – Fixed with InertiaPageProps
------------------------------------------------- */
interface UserProps {
  id: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
}

interface PageProps extends InertiaPageProps {
  user: UserProps;
  roles: string[];
  permissions: string[];
}

/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function Show() {
  const { user, roles, permissions } = usePage<PageProps>().props;

  const fullName = user.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user.name || 'Unknown User';

  const initials = user.first_name?.[0] || user.name?.[0] || 'U';
  const lastInitial = user.last_name?.[0] || '';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`User – ${fullName}`} />

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-8 h-8 text-teal-600" />
            User Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            {fullName} • ID: #{user.id}
          </p>
        </motion.div>

        {/* Back Button - Mobile */}
        <div className="sm:hidden mb-6">
          <Link href={route('users.index')}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </motion.button>
          </Link>
        </div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all"
        >
          {/* Header with Back Button (Desktop) */}
          <div className="hidden sm:flex justify-end mb-4">
            <Link href={route('users.index')}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Users
              </motion.button>
            </Link>
          </div>

          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {initials}
            {lastInitial && <span className="ml-1">{lastInitial}</span>}
          </div>

          {/* User Name */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {fullName}
            </h3>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Left: Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.phone}
                    </p>
                  </div>
                </div>
              )}

              {user.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Roles */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Assigned Roles</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {roles.length > 0 ? roles.join(', ') : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Roles Tags */}
          {roles && roles.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb bepal-2 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Roles
              </h4>
              <div className="flex flex-wrap gap-2">
                {roles.map((role, i) => (
                  <motion.span
                    key={role}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border-2 ${getColorClass(role)}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {role.replace(/_/g, ' ')}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Grid */}
          {permissions && permissions.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Permissions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map((perm, i) => {
                  const color = getColorClass(perm);
                  const description =
                    permissionDescriptions[perm] ||
                    'No description available for this permission.';

                  return (
                    <motion.div
                      key={perm}
                      className={`p-4 rounded-xl border-2 flex flex-col gap-1 transition-all ${color} backdrop-blur-sm`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      }}
                    >
                      <span className="font-semibold text-sm">
                        {perm.replace(/\./g, ' · ')}
                      </span>
                      <span className="text-xs leading-snug opacity-80">
                        {description}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-16 h-16 text-teal-600 dark:text-teal-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No permissions assigned.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}