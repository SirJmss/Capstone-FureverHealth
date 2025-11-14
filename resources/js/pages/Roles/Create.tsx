import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft, Plus, Check, AlertCircle } from 'lucide-react';
import InputError from '@/components/input-error';

// === COLOR PALETTE ===
const colors = [
  'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
] as const;

// === HASH FUNCTION ===
const getColorClass = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};

interface CreateProps {
  permissions?: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Roles', href: '/roles' },
  { title: 'Create Role', href: '/roles/create' },
];

export default function Create({ permissions = [] }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    permissions: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('roles.store'));
  };

  const togglePermission = (perm: string) => {
    const updated = data.permissions.includes(perm)
      ? data.permissions.filter(p => p !== perm)
      : [...data.permissions, perm];
    setData('permissions', updated);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Role" />

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-8 h-8 text-teal-600" />
                Create New Role
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Define role name and assign permissions
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

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Role Name */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Shield className="w-3.5 h-3.5" />
                Role Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Vet, Receptionist"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                className="h-11 rounded-lg text-sm"
                required
              />
              <InputError message={errors.name || ''} />
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Assign Permissions
              </Label>

              {permissions.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No permissions available.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissions.map((perm, i) => {
                    const isSelected = data.permissions.includes(perm);
                    const colorClass = getColorClass(perm);

                    return (
                      <motion.label
                        key={perm}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-xs font-medium
                          ${isSelected
                            ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 shadow-sm'
                            : `border-gray-200 dark:border-gray-600 ${colorClass} hover:shadow-sm`
                          }`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.02 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePermission(perm)}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="truncate">
                          {perm.replace(/\./g, ' · ')}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 ml-auto" />}
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
                {processing ? 'Creating...' : (
                  <>
                    <Plus className="w-4.5 h-4.5" />
                    Create Role
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