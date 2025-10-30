import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
  'user.view': 'Allows viewing user profiles and lists.',
  'user.create': 'Allows creating new users in the system.',
  'user.edit': 'Allows editing user details.',
  'user.delete': 'Allows deleting existing users.',

  'roles.view': 'Allows viewing all roles and their permissions.',
  'roles.create': 'Allows creating new roles.',
  'roles.edit': 'Allows modifying existing roles and their permissions.',
  'roles.delete': 'Allows removing roles permanently.',
};

/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Roles', href: '/roles' },
];

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function Show({ role }: { role: any }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Role – ${role.name}`} />

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
            Role Details – {role.name}
          </h1>

          <Link
            href={route('roles.index')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition"
          >
            ← Back
          </Link>
        </motion.div>

        {/* ---------- ROLE INFO CARD ---------- */}
        <motion.div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10 space-y-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* ---- NAME ---- */}
          <div>
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-1">
              Role Name
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {role.name}
            </p>
          </div>

          {/* ---- PERMISSIONS ---- */}
          {role.permissions && role.permissions.length > 0 ? (
            <div>
              <p className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-3">
                Assigned Permissions
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {role.permissions.map((perm: string, index: number) => {
                  const color = getColorClass(perm);
                  const description =
                    permissionDescriptions[perm] ||
                    'No description available for this permission.';

                  return (
                    <motion.div
                      key={index}
                      className={`p-4 border rounded-xl flex flex-col gap-1 transition-all ${color}`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
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
