import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Scissors, Stethoscope, Clock, DollarSign, ChevronLeft, Plus, Info, AlertCircle } from 'lucide-react';
import InputError from '@/components/input-error';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  roles: Role[];
}

interface Category {
  id: number;
  name: string;
}

interface CreateProps {
  users: User[];
  categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Services', href: '/services' },
  { title: 'Create Service', href: '/services/create' },
];

export default function Create({ users, categories }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    price: '',
    duration: '',
    user_id: '',
    category_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('services.store'));
  };

  // Filter users: Pet Groomer or Veterinarian
  const filteredUsers = users.filter(user =>
    user.roles.some(role => ['Pet Groomer', 'Veterinarian'].includes(role.name))
  );

  // Get available categories based on selected user
  const getAvailableCategories = () => {
    if (!data.user_id) return categories;

    const selectedUser = users.find(u => u.id === parseInt(data.user_id));
    if (!selectedUser) return categories;

    const roleNames = selectedUser.roles.map(r => r.name);
    if (roleNames.includes('Pet Groomer')) {
      return categories.filter(c => c.name === 'Grooming');
    }
    if (roleNames.includes('Veterinarian')) {
      return categories.filter(c => ['Treatment', 'Check-up'].includes(c.name));
    }
    return categories;
  };

  const availableCategories = getAvailableCategories();

  const getUserRoles = (user: User) => user.roles.map(r => r.name).join(', ');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Service" />

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-8 h-8 text-teal-600" />
                Create New Service
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Define service details and assign to staff
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button - Mobile */}
        <div className="sm:hidden mb-6">
          <Link href={route('services.index')}>
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
            <Link href={route('services.index')}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Services
              </motion.button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Row 1: Name + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Scissors className="w-3.5 h-3.5" />
                  Service Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Basic Grooming"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.name || ''} />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <DollarSign className="w-3.5 h-3.5" />
                  Price (₱) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={data.price}
                  onChange={e => setData('price', e.target.value)}
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.price || ''} />
              </div>
            </div>

            {/* Row 2: Duration + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  Duration (min) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  placeholder="60"
                  value={data.duration}
                  onChange={e => setData('duration', e.target.value)}
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.duration || ''} />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Category *
                </Label>
                <select
                  id="category_id"
                  value={data.category_id}
                  onChange={e => setData('category_id', e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-white"
                  disabled={availableCategories.length === 0}
                  required
                >
                  <option value="">Select Category</option>
                  {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {availableCategories.length === 0 && data.user_id && (
                  <p className="text-xs text-red-600 mt-1">No categories available</p>
                )}
                <InputError message={errors.category_id || ''} />
              </div>
            </div>

            {/* Service Provider */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Stethoscope className="w-3.5 h-3.5" />
                Service Provider *
              </Label>
              <select
                id="user_id"
                value={data.user_id}
                onChange={e => {
                  setData('user_id', e.target.value);
                  setData('category_id', '');
                }}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Provider</option>
                {filteredUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} — {getUserRoles(user)}
                  </option>
                ))}
              </select>
              {filteredUsers.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No groomers or vets available
                </p>
              )}
              <InputError message={errors.user_id || ''} />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Info className="w-3.5 h-3.5" />
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Describe the service..."
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                className="w-full h-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm resize-none"
                rows={2}
              />
              <InputError message={errors.description || ''} />
            </div>

            {/* Role Info Box */}
            {data.user_id && (
              <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-xs">
                <p className="font-medium text-teal-800 dark:text-teal-300 mb-1">Service Rules:</p>
                <ul className="space-y-0.5 text-teal-700 dark:text-teal-400">
                  <li>• <strong>Groomers</strong> → <em>Grooming</em> only</li>
                  <li>• <strong>Veterinarians</strong> → <em>Treatment</em>, <em>Check-up</em></li>
                </ul>
              </div>
            )}

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
                    Create Service
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