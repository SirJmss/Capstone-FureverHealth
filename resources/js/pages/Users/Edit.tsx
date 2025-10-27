import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'User Edit', href: '/users' },
];

export default function Edit({ user }: { user: any }) {
  const { data, setData, put, processing, errors } = useForm({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '',
    user_type: user?.user_type || 'admin',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('users.update', user.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Edit" />

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
            Edit User
          </h1>

          <Link href={route('users.index')}>
            <Button
              variant="outline"
              className="transition-all duration-300 hover:scale-105 hover:shadow-sm"
            >
              ← Back
            </Button>
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor={field.id} className="text-gray-700 mb-1">
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={`Enter ${field.label}`}
                  required
                  value={data[field.id as keyof typeof data] as string}
                  onChange={(e) => setData(field.id as keyof typeof data, e.target.value)}
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:shadow-md"
                />
                <InputError message={errors[field.id as keyof typeof errors]} />
              </motion.div>
            ))}

            {/* User Type */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <Label htmlFor="user_type" className="text-gray-700 mb-1">
                User Type
              </Label>
              <select
                id="user_type"
                name="user_type"
                value={data.user_type}
                onChange={(e) => setData('user_type', e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all duration-300"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <InputError message={errors.user_type} />
            </motion.div>

            {/* Spacer */}
            <div className="hidden md:block" />

            {/* Submit Button */}
            <motion.div
              className="md:col-span-2 flex justify-end mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-blue-200"
              >
                {processing ? 'Updating...' : 'Edit User'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}