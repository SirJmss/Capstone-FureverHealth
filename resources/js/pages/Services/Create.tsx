import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

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

  // Filter users to only show Pet Groomer and Veterinarian roles - CORRECT NAMES
  const filteredUsers = users.filter(user => {
    const userRoles = user.roles.map(role => role.name);
    return userRoles.includes('Pet Groomer') || userRoles.includes('Veterinarian');
  });

  // Get available categories based on selected user's role
  const getAvailableCategories = () => {
    if (!data.user_id) return categories;
    
    const selectedUser = users.find(user => user.id === parseInt(data.user_id));
    if (!selectedUser) return categories;

    const userRoles = selectedUser.roles.map(role => role.name);
    
    console.log('DEBUG - User Roles:', userRoles);
    console.log('DEBUG - Selected User:', selectedUser.first_name, selectedUser.last_name);

    if (userRoles.includes('Pet Groomer')) {
      const result = categories.filter(cat => cat.name === 'Grooming');
      console.log('DEBUG - Pet Groomer categories:', result);
      return result;
    } else if (userRoles.includes('Veterinarian')) {
      const result = categories.filter(cat => 
        cat.name === 'Treatment' || cat.name === 'Check-up'
      );
      console.log('DEBUG - Veterinarian categories:', result);
      return result;
    }
    
    console.log('DEBUG - No specific role, returning all categories');
    return categories;
  };

  const availableCategories = getAvailableCategories();

  // Helper to get user's role names as string
  const getUserRoles = (user: User) => {
    return user.roles.map(role => role.name).join(', ');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Service" />

      <motion.div
        className="p-4 md:p-6 flex items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Create New Service
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Define service details and assign to appropriate staff
              </p>
            </motion.div>

            <Link href={route('services.index')}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Services
              </motion.div>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name & Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                  Service Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Basic Grooming, Vaccination"
                  required
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <InputError message={errors.name} className="mt-1" />
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="price" className="text-gray-700 dark:text-gray-300 font-medium">
                  Price (₱)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <InputError message={errors.price} className="mt-1" />
              </motion.div>
            </div>

            {/* Duration & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Label htmlFor="duration" className="text-gray-700 dark:text-gray-300 font-medium">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  placeholder="e.g., 60"
                  required
                  value={data.duration}
                  onChange={(e) => setData('duration', e.target.value)}
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <InputError message={errors.duration} className="mt-1" />
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Label htmlFor="category_id" className="text-gray-700 dark:text-gray-300 font-medium">
                  Category
                </Label>
                <select
                  id="category_id"
                  required
                  value={data.category_id}
                  onChange={(e) => setData('category_id', e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
                  disabled={availableCategories.length === 0}
                >
                  <option value="">Select Category</option>
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {availableCategories.length === 0 && data.user_id && (
                  <p className="text-sm text-red-500 mt-1">
                    No available categories for the selected service provider
                  </p>
                )}
                <InputError message={errors.category_id} className="mt-1" />
              </motion.div>
            </div>

            {/* Service Provider */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="user_id" className="text-gray-700 dark:text-gray-300 font-medium">
                Service Provider
              </Label>
              <select
                id="user_id"
                required
                value={data.user_id}
                onChange={(e) => {
                  setData('user_id', e.target.value);
                  // Reset category when user changes
                  setData('category_id', '');
                }}
                className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
              >
                <option value="">Select Service Provider</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} - {getUserRoles(user)} - {user.email}
                  </option>
                ))}
              </select>
              {filteredUsers.length === 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  No pet groomers or veterinarians available for service assignment
                </p>
              )}
              <InputError message={errors.user_id} className="mt-1" />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-medium">
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Describe the service in detail..."
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="w-full h-24 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 mt-2 resize-none"
                rows={3}
              />
              <InputError message={errors.description} className="mt-1" />
            </motion.div>

            {/* Role-based restrictions info */}
            {data.user_id && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              >
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Service Restrictions:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• <strong>Pet Groomers</strong> can only be assigned to <strong>Grooming</strong> services</li>
                  <li>• <strong>Veterinarians</strong> can only be assigned to <strong>Treatment</strong> and <strong>Check-up</strong> services</li>
                </ul>
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              className="pt-6 flex justify-end"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={processing}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-base shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Service'
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}