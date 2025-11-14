import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { useState, useEffect } from 'react';
import { Scissors, DollarSign, Clock, User, Tag, Info, AlertCircle, ChevronLeft, Save } from 'lucide-react';

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
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Services', href: '/services' },
    { title: 'Edit Service', href: '' },
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

  const filteredUsers = users.filter(user =>
    user.roles.some(role => ['Pet Groomer', 'Veterinarian'].includes(role.name))
  );

  const getAvailableCategories = () => {
    if (!data.user_id) return categories;
    const user = users.find(u => u.id === parseInt(data.user_id));
    if (!user) return categories;
    const roles = user.roles.map(r => r.name);
    if (roles.includes('Pet Groomer')) return categories.filter(c => c.name === 'Grooming');
    if (roles.includes('Veterinarian')) return categories.filter(c => ['Treatment', 'Check-up'].includes(c.name));
    return categories;
  };

  const availableCategories = getAvailableCategories();

  const validateUserCategoryAssignment = () => {
    if (!data.user_id || !service.category_id) return true;
    const user = users.find(u => u.id === parseInt(data.user_id));
    const category = categories.find(c => c.id === service.category_id);
    if (!user || !category) return true;
    const roles = user.roles.map(r => r.name);
    if (roles.includes('Pet Groomer') && category.name !== 'Grooming') return false;
    if (roles.includes('Veterinarian') && !['Treatment', 'Check-up'].includes(category.name)) return false;
    return true;
  };

  useEffect(() => {
    setValidationError('');
  }, [data.user_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUserCategoryAssignment()) {
      const user = users.find(u => u.id === parseInt(data.user_id));
      const category = categories.find(c => c.id === service.category_id);
      setValidationError(
        `${user?.first_name} ${user?.last_name} (${user?.roles.map(r => r.name).join(', ')}) cannot be assigned to ${category?.name} services.`
      );
      return;
    }
    setValidationError('');
    put(route('services.update', service.id));
  };

  const getUserRoles = (user: User) => user.roles.map(r => r.name).join(', ');
  const currentProvider = users.find(u => u.id === service.user_id);
  const currentCategory = categories.find(c => c.id === service.category_id);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Service: ${service.name}`} />

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-8 h-8 text-teal-600" />
                Edit Service
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Update service details and staff assignment
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 px-2.5 py-1 rounded-full font-medium">
                  ID: #{service.id}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
                  {currentCategory?.name || '—'}
                </span>
              </div>
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

        {/* CARD */}
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

            {/* Name & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Scissors className="w-3.5 h-3.5" />
                  Service Name
                </Label>
                <div className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  {service.name}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">Name cannot be changed</p>
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <DollarSign className="w-3.5 h-3.5" />
                  Price *
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.price}
                  onChange={e => setData('price', e.target.value)}
                  placeholder="0.00"
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.price || ''} />
              </div>
            </div>

            {/* Duration & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  Duration (min) *
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={data.duration}
                  onChange={e => setData('duration', e.target.value)}
                  placeholder="60"
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.duration || ''} />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Tag className="w-3.5 h-3.5" />
                  Category
                </Label>
                <div className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  {currentCategory?.name || '—'}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">Category cannot be changed</p>
              </div>
            </div>

            {/* Service Provider */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <User className="w-3.5 h-3.5" />
                Service Provider *
              </Label>
              <select
                value={data.user_id}
                onChange={e => setData('user_id', e.target.value)}
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
              {currentProvider && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Current: {currentProvider.first_name} {currentProvider.last_name} ({getUserRoles(currentProvider)})
                </p>
              )}
              {filteredUsers.length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
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
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder="Describe the service..."
                className="w-full h-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm resize-none"
                rows={2}
              />
              <InputError message={errors.description || ''} />
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-300">Assignment Error</p>
                  <p className="text-red-700 dark:text-red-400">{validationError}</p>
                </div>
              </div>
            )}

            {/* Role Info */}
            {data.user_id && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs">
                <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Service Restrictions:</p>
                <ul className="text-blue-700 dark:text-blue-400 space-y-0.5">
                  <li>• <strong>Pet Groomers</strong> → <strong>Grooming</strong> only</li>
                  <li>• <strong>Veterinarians</strong> → <strong>Treatment</strong> & <strong>Check-up</strong></li>
                  {currentCategory && (
                    <li className="font-medium mt-1">
                      Current: <span className="underline">{currentCategory.name}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              <Link href={route('services.index')}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={processing || !!validationError}
                className="px-7 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md flex items-center gap-2 hover:shadow-lg transition disabled:opacity-50 text-sm"
              >
                {processing ? 'Updating...' : (
                  <>
                    <Save className="w-4.5 h-4.5" />
                    Update Service
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