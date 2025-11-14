import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { User, Mail, Phone, MapPin, Shield, ChevronLeft, Save, Check } from 'lucide-react';

/* -------------------------------------------------
   COLOR PALETTE + HASH FUNCTION
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
      setData('roles', data.roles.filter(r => r !== roleName));
    } else {
      setData('roles', [...data.roles, roleName]);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${user.first_name} ${user.last_name}`} />

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-8 h-8 text-teal-600" />
                Edit User
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                {user.first_name} {user.last_name} • ID: #{user.id}
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

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all max-w-4xl mx-auto"
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

            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <User className="w-3.5 h-3.5" />
                  First Name *
                </Label>
                <Input
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
                  Last Name *
                </Label>
                <Input
                  value={data.last_name}
                  onChange={e => setData('last_name', e.target.value)}
                  placeholder="Doe"
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.last_name || ''} />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  Email *
                </Label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  placeholder="john@example.com"
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.email || ''} />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Phone className="w-3.5 h-3.5" />
                  Phone
                </Label>
                <Input
                  value={data.phone}
                  onChange={e => setData('phone', e.target.value)}
                  placeholder="+1 234 567 890"
                  className="h-11 rounded-lg text-sm"
                />
                <InputError message={errors.phone || ''} />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                Address
              </Label>
              <Input
                value={data.address}
                onChange={e => setData('address', e.target.value)}
                placeholder="123 Main St, City, Country"
                className="h-11 rounded-lg text-sm"
              />
              <InputError message={errors.address || ''} />
            </div>

            {/* Roles – Colored Tags */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Shield className="w-3.5 h-3.5" />
                Assign Roles
              </Label>

              {allRoles.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  No roles available.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allRoles.map((role, i) => {
                    const isActive = data.roles.includes(role.name);
                    const color = getColorClass(role.name);

                    return (
                      <motion.label
                        key={role.id}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer select-none
                          ${isActive
                            ? `${color} ring-1 ring-current shadow-sm`
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 + i * 0.02 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleRole(role.name)}
                          className="sr-only"
                        />
                        <Check className={`w-3.5 h-3.5 ${isActive ? 'block' : 'hidden'}`} />
                        <span className="capitalize">{role.name.replace(/_/g, ' ')}</span>
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
                {processing ? 'Updating...' : (
                  <>
                    <Save className="w-4.5 h-4.5" />
                    Update User
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