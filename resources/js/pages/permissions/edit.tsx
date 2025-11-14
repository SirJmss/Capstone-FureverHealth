import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { Shield, ChevronLeft, Save } from 'lucide-react';

// === COLOR PALETTE ===
const colors = [
  'bg-red-100 text-red-700 border-red-300',
  'bg-yellow-100 text-yellow-700 border-yellow-300',
  'bg-green-100 text-green-700 border-green-300',
  'bg-blue-100 text-blue-700 border-blue-300',
  'bg-indigo-100 text-indigo-700 border-indigo-300',
  'bg-purple-100 text-purple-700 border-purple-300',
  'bg-pink-100 text-pink-700 border-pink-300',
  'bg-orange-100 text-orange-700 border-orange-300',
];

// === HASH FUNCTION FOR CONSISTENT COLOR ===
const getColorClass = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Permissions', href: '/permissions' },
  { title: 'Edit Permission', href: '' },
];

interface EditProps {
  permissions: {
    id: number;
    name: string;
  };
}

export default function Edit({ permissions }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: permissions.name || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('permissions.update', permissions.id));
  };

  const colorClass = getColorClass(permissions.name);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Permission" />

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-8 h-8 text-teal-600" />
                Edit Permission
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Update permission name
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button - Mobile */}
        <div className="sm:hidden mb-6">
          <Link href={route('permissions.index')}>
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
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all max-w-2xl mx-auto"
        >
          {/* Back Button - Desktop */}
          <div className="hidden sm:flex justify-end mb-4">
            <Link href={route('permissions.index')}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Permissions
              </motion.button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Permission Badge */}
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`px-5 py-2.5 rounded-full border font-medium text-sm shadow-sm ${colorClass}`}
              >
                {permissions.name}
              </motion.div>
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Shield className="w-3.5 h-3.5" />
                Permission Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., manage_users"
                required
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                className="h-11 rounded-lg text-sm"
              />
              <InputError message={errors.name || ''} />
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
                {processing ? 'Updating...' : (
                  <>
                    <Save className="w-4.5 h-4.5" />
                    Update Permission
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