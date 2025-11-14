import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Shield, ChevronLeft, Plus, Check } from 'lucide-react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Users', href: '/users' },
  { title: 'Create User', href: '' },
];

interface CreateProps {
  roles: string[];
}

export default function Create({ roles }: CreateProps) {
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

  const toggleRole = (role: string) => {
    setData('roles', data.roles.includes(role)
      ? data.roles.filter(r => r !== role)
      : [...data.roles, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('users.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-8 h-8 text-teal-600" />
                Create New User
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Add a new staff or admin user
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button - Mobile */}
        <div className="sm:hidden mb-6">
          <Link href={route('users.index')}>
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
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all max-w-3xl mx-auto"
        >
          {/* Back Button - Desktop */}
          <div className="hidden sm:flex justify-end mb-4">
            <Link href={route('users.index')}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Users
              </motion.button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Row 1: First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <User className="w-3.5 h-3.5" />
                  First Name *
                </Label>
                <Input
                  id="first_name"
                  value={data.first_name}
                  onChange={e => setData('first_name', e.target.value)}
                  placeholder="John"
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.first_name || ''} />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <User className="w-3.5 h-3.5" />
                  Last Name *
                </Label>
                <Input
                  id="last_name"
                  value={data.last_name}
                  onChange={e => setData('last_name', e.target.value)}
                  placeholder="Doe"
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.last_name || ''} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Mail className="w-3.5 h-3.5" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="john@example.com"
                className="h-11 rounded-lg text-sm"
                required
              />
              <InputError message={errors.email || ''} />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Phone className="w-3.5 h-3.5" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={e => setData('phone', e.target.value)}
                placeholder="+1 234 567 890"
                className="h-11 rounded-lg text-sm"
              />
              <InputError message={errors.phone || ''} />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Lock className="w-3.5 h-3.5" />
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-lg text-sm"
                required
              />
              <InputError message={errors.password || ''} />
            </div>

            {/* Roles */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Assign Roles
              </Label>

              {roles.length === 0 ? (
                <div className="text-center py-6">
                  <Shield className="w-9 h-9 mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No roles available.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {roles.map((role, i) => {
                    const isSelected = data.roles.includes(role);
                    return (
                      <motion.label
                        key={role}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-xs font-medium
                          ${isSelected
                            ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 shadow-sm'
                            : 'border-gray-200 dark:border-gray-600 hover:shadow-sm'
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
                          onChange={() => toggleRole(role)}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="truncate capitalize">
                          {role.replace(/_/g, ' ')}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 ml-auto" />}
                      </motion.label>
                    );
                  })}
                </div>
              )}
              <InputError message={errors.roles || ''} />
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
                    Create User
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