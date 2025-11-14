import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft, Plus } from 'lucide-react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Permissions', href: '/permissions' },
  { title: 'Create Permission', href: '/permissions/create' },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({ name: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('permissions.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Permission" />

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-8 h-8 text-teal-600" />
                Create Permission
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Add a new system permission
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

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all"
        >
          {/* Header with Back Button (Desktop) */}
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

          <form onSubmit={submit} className="space-y-6">

            {/* Permission Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Permission Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g. user.edit"
                required
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                className="h-12 rounded-xl"
              />
              <InputError message={errors.name || ''} />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={processing}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition disabled:opacity-50"
              >
                {processing ? 'Creating...' : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Permission
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