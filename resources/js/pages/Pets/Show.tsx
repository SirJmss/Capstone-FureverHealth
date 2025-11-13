import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';

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
   TYPES
------------------------------------------------- */
interface PetProps {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: string;
  weight: string;
  medical_history: string;
  allergies: string;
  vaccinated: boolean;
  grooming_notes: string;
  last_groomed_at: string;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  pet: PetProps;
  [key: string]: any;
}

/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs = (petName: string): BreadcrumbItem[] => [
  { title: 'Pets', href: '/pets' },
  { title: petName, href: '' },
];

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function Show() {
  const { pet } = usePage<PageProps>().props;

  const getSpeciesIcon = (species: string) => {
    const icons: { [key: string]: string } = {
      dog: '🐕',
      cat: '🐈',
      rabbit: '🐇',
      bird: '🐦',
      fish: '🐠',
      hamster: '🐹',
      reptile: '🦎',
      other: '🐾',
    };
    return icons[species.toLowerCase()] || icons.other;
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? '♂' : '♀';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAge = (age: string) => {
    if (!age) return 'Unknown';
    return `${age} year${parseFloat(age) !== 1 ? 's' : ''} old`;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(pet.name)}>
      <Head title={`Pet – ${pet.name}`} />

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
                Pet Profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {pet.name} • ID: #{pet.id}
              </p>
            </motion.div>

            <Link href={route('pets.index')}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Pets
              </motion.div>
            </Link>
          </div>

          {/* Pet Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left: Avatar + Basic Info */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >

              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{pet.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Species & Breed</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {pet.species} • {pet.breed || 'Mixed'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Age & Gender</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatAge(pet.age)} • {getGenderIcon(pet.gender)} {pet.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weight</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {pet.weight ? `${pet.weight} kg` : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Health & Status */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Health Status</h3>
  <div className="space-y-3">
    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vaccination Status</span>
      <motion.span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          pet.vaccinated 
            ? 'text-green-700 dark:text-green-400' 
            : 'text-red-700 dark:text-red-400'
        }`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        {pet.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
      </motion.span>
    </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Grooming</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(pet.last_groomed_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Allergies */}
              {pet.allergies && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Allergies</h3>
                  <motion.div
                    className="p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">{pet.allergies}</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Medical History */}
          {pet.medical_history && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Medical History</h3>
              <motion.div
                className="p-4 rounded-xl border "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm whitespace-pre-wrap">{pet.medical_history}</p>
              </motion.div>
            </motion.div>
          )}

          {/* Grooming Notes */}
          {pet.grooming_notes && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Grooming Notes</h3>
              <motion.div
                className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                <p className="text-sm text-purple-700 dark:text-purple-400 whitespace-pre-wrap">{pet.grooming_notes}</p>
              </motion.div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href={route('pets.edit', pet.id)}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 font-medium text-sm transition hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Pet
              </motion.div>
            </Link>
            
            <Link href={route('pets.index')}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 font-medium text-sm transition hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View All Pets   
                </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}