import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

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
  { title: 'Permission', href: '/permissions' },
  { title: 'Create Permission', href: '/permissions/create' },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('permissions.store'));
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Permission" />

      <motion.div
        className="p-8 min-h-[80vh] flex flex-col items-center bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="flex justify-between items-center w-full max-w-3xl mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
            Create New Permission
          </h1>
          <Link href={route('permissions.index')}>
            <Button variant="outline">Back</Button>
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Role Name */}
            <div>
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Permission Name"
                required
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              <InputError message={errors.name} />
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {processing ? 'Creating...' : 'Create Role'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}