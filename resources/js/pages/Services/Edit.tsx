import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  user_id: number;
  category_id: number;
  user?: User;
  category?: Category;
}

interface EditProps {
  service: Service;
  users: User[];
  categories: Category[];
}

export default function Edit({ service, users, categories }: EditProps) {
  // Move breadcrumbs inside the component where service is available
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Services', href: '/services' },
    { title: 'Edit Service', href: `/services/${service.id}/edit` },
  ];

  const { data, setData, put, processing, errors } = useForm({
    name: service.name,
    description: service.description || '',
    price: service.price.toString(),
    duration: service.duration?.toString() || '',
    user_id: service.user_id?.toString() || '',
    category_id: service.category_id?.toString() || '',
  });

  const [validationError, setValidationError] = useState<string>('');

  // Filter users to only show Pet Groomer and Veterinarian roles
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

    if (userRoles.includes('Pet Groomer')) {
      return categories.filter(cat => cat.name === 'Grooming');
    } else if (userRoles.includes('Veterinarian')) {
      return categories.filter(cat => 
        cat.name === 'Treatment' || cat.name === 'Check-up'
      );
    }
    
    return categories;
  };

  const availableCategories = getAvailableCategories();

  // Validate if selected user can be assigned to the current service category
  const validateUserCategoryAssignment = () => {
    if (!data.user_id || !service.category_id) return true;

    const selectedUser = users.find(user => user.id === parseInt(data.user_id));
    const currentCategory = categories.find(cat => cat.id === service.category_id);

    if (!selectedUser || !currentCategory) return true;

    const userRoles = selectedUser.roles.map(role => role.name);

    // Check if user's role matches the service category
    if (userRoles.includes('Pet Groomer') && currentCategory.name !== 'Grooming') {
      return false;
    }

    if (userRoles.includes('Veterinarian') && 
        !['Treatment', 'Check-up'].includes(currentCategory.name)) {
      return false;
    }

    return true;
  };

  // Reset validation error when user changes
  useEffect(() => {
    setValidationError('');
  }, [data.user_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate user-category assignment
    if (!validateUserCategoryAssignment()) {
      const selectedUser = users.find(user => user.id === parseInt(data.user_id));
      const currentCategory = categories.find(cat => cat.id === service.category_id);
      
      setValidationError(
        `${selectedUser?.first_name} ${selectedUser?.last_name} (${selectedUser?.roles.map(r => r.name).join(', ')}) cannot be assigned to ${currentCategory?.name} services.`
      );
      return;
    }

    setValidationError('');
    put(route('services.update', service.id));
  };

  // Helper to get user's role names as string
  const getUserRoles = (user: User) => {
    return user.roles.map(role => role.name).join(', ');
  };

  // Get current service provider
  const currentServiceProvider = users.find(user => user.id === service.user_id);
  // Get current category
  const currentCategory = categories.find(cat => cat.id === service.category_id);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Service - ${service.name}`} />

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
                Edit Service
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update service details and staff assignment
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                  ID: #{service.id}
                </span>
                <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full">
                  {currentCategory?.name || 'No Category'}
                </span>
              </div>
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
                <div className="mt-2">
                  <div className="h-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 flex items-center">
                    {service.name}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                    Service name cannot be changed
                  </p>
                </div>
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
                <div className="mt-2">
                  <div className="h-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 flex items-center">
                    {currentCategory?.name || 'No Category'}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                    Category cannot be changed
                  </p>
                </div>
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
                onChange={(e) => setData('user_id', e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
              >
                <option value="">Select Service Provider</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} - {getUserRoles(user)} - {user.email}
                  </option>
                ))}
              </select>
              {currentServiceProvider && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Current: {currentServiceProvider.first_name} {currentServiceProvider.last_name} 
                  {currentServiceProvider.roles.length > 0 && ` (${getUserRoles(currentServiceProvider)})`}
                </p>
              )}
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

            {/* Validation Error */}
            {validationError && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Assignment Error</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {validationError}
                </p>
              </motion.div>
            )}

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
                  {currentCategory && (
                    <li className="font-semibold mt-2">
                      Current service category: <span className="underline">{currentCategory.name}</span>
                    </li>
                  )}
                </ul>
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              className="pt-6 flex justify-end gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href={route('services.index')}>
                <Button
                  type="button"
                  variant="outline"
                  className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium transition hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={processing || !!validationError}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-base shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Service'
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}