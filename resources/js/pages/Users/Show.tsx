import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';

/* -------------------------------------------------
   COLOR PALETTE + HASH FUNCTION
------------------------------------------------- */
const colors = [
  'bg-red-100 text-red-700 border-red-300',
  'bg-yellow-100 text-yellow-700 border-yellow-300',
  'bg-green-100 text-green-700 border-green-300',
  'bg-blue-100 text-blue-700 border-blue-300',
  'bg-indigo-100 text-indigo-700 border-indigo-300',
  'bg-purple-100 text-purple-700 border-purple-300',
  'bg-pink-100 text-pink-700 border-pink-300',
  'bg-orange-100 text-orange-700 border-orange-300',
] as const;

const getColorClass = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};

/* -------------------------------------------------
   PERMISSION DESCRIPTIONS
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
   TYPES
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

interface PageProps {
  user: UserProps;
  roles: string[];
  permissions: string[];
  [key: string]: any; // ← ADD THIS LINE
}

/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

/* -------------------------------------------------
   GET PAGE PROPS (FIXED: OUTSIDE COMPONENT)
------------------------------------------------- */

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function Show() {
  const { user, roles, permissions } = usePage<PageProps>().props;
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`User – ${user.first_name ?? user.name}`} />

      <motion.div
        className="p-8 min-h-[80vh] flex flex-col items-center bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* ---------- HEADER ---------- */}
        <motion.div
          className="flex justify-between items-center w-full max-w-3xl mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
            User Details – {user.first_name ?? user.name}
          </h1>

          <Link
            href={route('users.index')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition"
          >
            Back
          </Link>
        </motion.div>

        {/* ---------- USER INFO CARD ---------- */}
        <motion.div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10 space-y-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* ---- BASIC INFO ---- */}
          <div className="space-y-2">
            <p>
              <strong className="text-gray-700">Name:</strong>{' '}
              <span className="text-gray-900">
                {user.first_name} {user.last_name}
              </span>
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

          {/* ---- ROLES ---- */}
          {roles && roles.length > 0 && (
            <div>
              <p className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-3">
                Assigned Roles
              </p>

              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <motion.span
                    key={role}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getColorClass(
                      role
                    )}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {role}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* ---- PERMISSIONS ---- */}
          {permissions && permissions.length > 0 ? (
            <div>
              <p className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-3">
                Permissions
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissions.map((perm) => {
                  const color = getColorClass(perm);
                  const description =
                    permissionDescriptions[perm] ||
                    'No description available for this permission.';

                  return (
                    <motion.div
                      key={perm}
                      className={`p-4 border rounded-xl flex flex-col gap-1 transition-all ${color}`}
                      whileHover={{ 
                        scale: 1.03, 
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)' // FIXED: full shadow string
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="font-semibold text-sm">{perm}</span>
                      <span className="text-xs text-gray-600 leading-snug">
                        {description}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No permissions assigned.</p>
          )}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}