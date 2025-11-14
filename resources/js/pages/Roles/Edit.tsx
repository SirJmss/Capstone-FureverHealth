import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { Shield, ChevronLeft, Save, Check } from 'lucide-react';

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
      setData('permissions', data.permissions.filter(p => p !== permission));
    } else {
      setData('permissions', [...data.permissions, permission]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('roles.update', role.id));
  };

  const colorClass = getColorClass(role.name);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Role: ${role.name}`} />

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-8 h-8 text-teal-600" />
                Edit Role
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Update role name and permissions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button - Mobile */}
        <div className="sm:hidden mb-6">
          <Link href={route('roles.index')}>
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

        {/* CARD – COMPACT & BALANCED */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all max-w-4xl mx-auto"
        >
          {/* Back Button - Desktop */}
          <div className="hidden sm:flex justify-end mb-4">
            <Link href={route('roles.index')}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Roles
              </motion.button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role Badge */}
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`px-5 py-2.5 rounded-full border font-medium text-sm shadow-sm ${colorClass}`}
              >
                {role.name}
              </motion.div>
            </div>

            {/* Role Name */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Shield className="w-3.5 h-3.5" />
                Role Name *
              </Label>
              <input
                type="text"
                placeholder="e.g., Moderator"
                required
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                disabled={processing}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition disabled:opacity-50"
              />
              <InputError message={errors.name || ''} />
            </div>

            {/* Permissions */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Check className="w-3.5 h-3.5" />
                Assign Permissions
              </Label>

              {allPermissions.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  No permissions available.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {allPermissions.map((perm, i) => {
                    const isSelected = data.permissions.includes(perm);
                    const bgColor = getColorClass(perm);

                    return (
                      <motion.label
                        key={perm}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-200 select-none
                          ${isSelected
                            ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-500 shadow-sm ring-1 ring-teal-200 dark:ring-teal-800'
                            : `border-gray-300 dark:border-gray-600 ${bgColor} hover:ring-1 hover:ring-current`
                          }`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 + i * 0.01 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          value={perm}
                          checked={isSelected}
                          onChange={() => togglePermission(perm)}
                          disabled={processing}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                        />
                        <span
                          className={`text-xs font-medium truncate px-2 py-1 rounded-full transition-all
                            ${isSelected
                              ? 'bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300'
                              : bgColor
                            }`}
                        >
                          {perm.replace(/\./g, ' · ')}
                        </span>
                      </motion.label>
                    );
                  })}
                </div>
              )}

              <InputError message={errors.permissions || ''} />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={processing}
                className="px-7 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition disabled:opacity-50 text-sm"
              >
                {processing ? 'Saving...' : (
                  <>
                    <Save className="w-4.5 h-4.5" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppLayout>
  );
}