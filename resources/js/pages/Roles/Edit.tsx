import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

/* -------------------------------------------------
   COLOR PALETTE & HASH FUNCTION
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
   TYPES
------------------------------------------------- */
interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface EditProps {
  role: Role;
  allPermissions: string[];
}

/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Roles', href: '/roles' },
  { title: 'Edit Role', href: '' },
];

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function Edit({ role, allPermissions }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: role.name || '',
    permissions: role.permissions || [],
  });

  const togglePermission = (permission: string) => {
    if (data.permissions.includes(permission)) {
      setData('permissions', data.permissions.filter((p) => p !== permission));
    } else {
      setData('permissions', [...data.permissions, permission]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('roles.update', role.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Role – ${role.name}`} />

      <motion.div
        className="p-4 md:p-6 flex items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Edit Role
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update role name and permissions
              </p>
            </motion.div>

            <Link href={route('roles.index')}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Roles
              </motion.div>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Name */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                Role Name
              </Label>
              <input
                id="name"
                type="text"
                placeholder="e.g., Moderator"
                required
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                disabled={processing}
                className="mt-2 w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              />
              <InputError message={errors.name} className="mt-1" />
            </motion.div>

            {/* Permissions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                Assign Permissions
              </Label>

              {allPermissions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No permissions available.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allPermissions.map((perm, i) => {
                    const isSelected = data.permissions.includes(perm);
                    const colorClass = getColorClass(perm);

                    return (
                      <motion.label
                        key={perm}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                          ${isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md ring-2 ring-blue-200 dark:ring-blue-800'
                            : `border-transparent ${colorClass} hover:ring-2 hover:ring-current`
                          }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.03 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          value={perm}
                          checked={isSelected}
                          onChange={() => togglePermission(perm)}
                          disabled={processing}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span
                          className={`text-sm font-medium truncate px-3 py-1.5 rounded-full transition-all
                            ${isSelected
                              ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                              : colorClass
                            }`}
                        >
                          {perm.replace(/\./g, ' · ')}
                        </span>
                      </motion.label>
                    );
                  })}
                </div>
              )}

              <InputError message={errors.permissions} className="mt-2" />
            </motion.div>

            {/* Submit */}
            <motion.div
              className="pt-6 flex justify-end"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={processing}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-base shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}