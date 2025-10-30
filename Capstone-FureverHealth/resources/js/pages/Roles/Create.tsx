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
            Create New Role
          </h1>
          <Link href={route('roles.index')}>
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
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Role Name"
                required
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              <InputError message={errors.name} />
            </div>

            {/* Permissions with Color */}
            <div>
              <Label>Assign Permissions</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {permissions.map((perm) => {
                  const isSelected = data.permissions.includes(perm);
                  const colorClass = getColorClass(perm);

                  return (
                    <motion.label
                      key={perm}
                      className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all duration-200 select-none
                        ${isSelected
                          ? 'bg-blue-50 border-blue-500 shadow-sm'
                          : `border ${colorClass.replace('bg-', 'hover:bg-').replace('text-', 'hover:text-')}`
                        }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="checkbox"
                        value={perm}
                        checked={isSelected}
                        onChange={() => togglePermission(perm)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`text-sm font-medium truncate px-2 py-1 rounded-full transition-all
                          ${isSelected
                            ? 'bg-blue-100 text-blue-700'
                            : colorClass
                          }`}
                      >
                        {perm}
                      </span>
                    </motion.label>
                  );
                })}
              </div>
              <InputError message={errors.permissions} />
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