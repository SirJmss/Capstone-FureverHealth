import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

/* -------------------------------------------------
   COLOR PALETTE + HASH FUNCTION (from Show.tsx)
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
   TYPES & BREADCRUMBS
------------------------------------------------- */
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  user_type: string;
  roles: string[];
}

interface Role {
  id: number;
  name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Users', href: '/users' },
  { title: 'Edit User', href: '' },
];

interface Props {
  user: User;
  allRoles: Role[];
}

export default function Edit({ user, allRoles }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    password: '',
    user_type: user.user_type || 'admin',
    roles: user.roles || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('users.update', user.id));
  };

  const toggleRole = (roleName: string) => {
    if (data.roles.includes(roleName)) {
      setData('roles', data.roles.filter((r) => r !== roleName));
    } else {
      setData('roles', [...data.roles, roleName]);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit – ${user.first_name} ${user.last_name}`} />

      <motion.div
        className="p-6 min-h-[80vh] flex flex-col items-center bg-gradient-to-b from-gray-50 to-white"
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
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Edit User
          </h1>

          <Link href={route('users.index')}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm transition-all hover:shadow-md"
            >
              Back
            </motion.div>
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Fields */}
            {[
              { id: 'first_name', label: 'First Name', type: 'text' },
              { id: 'last_name', label: 'Last Name', type: 'text' },
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'phone', label: 'Phone Number', type: 'tel' },
              { id: 'address', label: 'Address', type: 'text' },
            ].map((field, i) => (
              <motion.div
                key={field.id}
                className="flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Label htmlFor={field.id} className="text-sm font-semibold text-gray-700 mb-1.5">
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required
                  value={data[field.id as keyof typeof data] as string}
                  onChange={(e) => setData(field.id as keyof typeof data, e.target.value)}
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:shadow-lg focus:border-blue-500"
                />
                <InputError message={errors[field.id as keyof typeof errors]} />
              </motion.div>
            ))}

            {/* Roles – NOW COLORED LIKE SHOW */}
            <motion.div
              className="flex flex-col md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Label className="text-sm font-semibold text-gray-700 mb-3">Roles</Label>
              <div className="flex flex-wrap gap-2">
                {allRoles.length === 0 ? (
                  <p className="text-sm text-gray-500">No roles available.</p>
                ) : (
                  allRoles.map((role) => {
                    const isActive = data.roles.includes(role.name);
                    const color = getColorClass(role.name);
                    return (
                      <motion.label
                        key={role.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                          isActive ? color : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleRole(role.name)}
                          className="sr-only"
                        />
                        <span>{role.name}</span>
                      </motion.label>
                    );
                  })
                )}
              </div>
              <InputError message={errors.roles} />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="md:col-span-2 flex justify-end mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={processing}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
              >
                {processing ? 'Updating...' : 'Update User'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}