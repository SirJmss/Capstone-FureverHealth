import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

// ✅ Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Users', href: '/users' },
  { title: 'Create User', href: '' },
];

// ✅ Props type
interface CreateProps {
  roles: string[];
}

// ✅ Component
export default function Create({ roles }: CreateProps) {
  // ✅ useForm must be INSIDE the component
  const { data, setData, post, processing, errors } = useForm<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    user_type: string;
    roles: string[];
  }>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'user',
    roles: [],
  });

  // ✅ toggleRole handler
const toggleRole = (role: string) => {
  // Use the latest `data.roles` directly, not a callback
  if (data.roles.includes(role)) {
    setData('roles', data.roles.filter((r) => r !== role));
  } else {
    setData('roles', [...data.roles, role]);
  }
};


  // ✅ submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('users.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />

      <motion.div
        className="p-6 flex flex-col items-center min-h-[80vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Create User</h1>
            <Link href={route('users.index')}>
              <Button variant="outline" className="px-4">
                Back
              </Button>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                placeholder="John"
              />
              <InputError message={errors.first_name} />
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                placeholder="Doe"
              />
              <InputError message={errors.last_name} />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="john@example.com"
              />
              <InputError message={errors.email} />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="+1234567890"
              />
              <InputError message={errors.phone} />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="********"
              />
              <InputError message={errors.password} />
            </div>
            
            {/* Roles */}
            <div>
              <Label>Roles</Label>
              <div className="mt-2 space-y-2">
                {roles.length === 0 ? (
                  <p className="text-sm text-gray-500">No roles available.</p>
                ) : (
                  roles.map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-2 text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={data.roles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))
                )}
              </div>
              <InputError message={errors.roles} />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                {processing ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </AppLayout>
  );
}
