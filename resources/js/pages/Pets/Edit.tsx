import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

type Pet = {
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
};

type Props = {
  pet: Pet;
};

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pets', href: '/pets' },
  { title: 'Edit Pet', href: '' },
];

export default function EditPet({ pet }: Props) {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: pet.name || "",
    species: pet.species || "",
    breed: pet.breed || "",
    gender: pet.gender || "male",
    age: pet.age || "",
    weight: pet.weight || "",
    medical_history: pet.medical_history || "",
    allergies: pet.allergies || "",
    vaccinated: pet.vaccinated || false,
    grooming_notes: pet.grooming_notes || "",
    last_groomed_at: pet.last_groomed_at || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('pets.update', pet.id), {
      onSuccess: () => {
        // Optionally show success message or redirect
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Pet" />

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
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Edit Pet: {pet.name}
            </motion.h1>

            <Link href={route('pets.index')}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </motion.div>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Species Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                  Pet Name
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Buddy"
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <InputError message={errors.name} className="mt-1" />
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="species" className="text-gray-700 dark:text-gray-300 font-medium">
                  Species
                </Label>
                <Input
                  id="species"
                  value={data.species}
                  onChange={(e) => setData('species', e.target.value)}
                  placeholder="Dog / Cat / Rabbit"
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <InputError message={errors.species} className="mt-1" />
              </motion.div>
            </div>

            {/* Breed & Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Label htmlFor="breed" className="text-gray-700 dark:text-gray-300 font-medium">
                  Breed
                </Label>
                <Input
                  id="breed"
                  value={data.breed}
                  onChange={(e) => setData('breed', e.target.value)}
                  placeholder="Golden Retriever"
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <InputError message={errors.breed} className="mt-1" />
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Label htmlFor="gender" className="text-gray-700 dark:text-gray-300 font-medium">
                  Gender
                </Label>
                <select
                  id="gender"
                  value={data.gender}
                  onChange={(e) => setData('gender', e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <InputError message={errors.gender} className="mt-1" />
              </motion.div>
            </div>

            {/* Age & Weight Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="age" className="text-gray-700 dark:text-gray-300 font-medium">
                  Age (years)
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={data.age}
                  onChange={(e) => setData('age', e.target.value)}
                  placeholder="3"
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <InputError message={errors.age} className="mt-1" />
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="weight" className="text-gray-700 dark:text-gray-300 font-medium">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={data.weight}
                  onChange={(e) => setData('weight', e.target.value)}
                  placeholder="25.5"
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <InputError message={errors.weight} className="mt-1" />
              </motion.div>
            </div>

            {/* Vaccinated Checkbox */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <input
                type="checkbox"
                id="vaccinated"
                checked={data.vaccinated}
                onChange={(e) => setData('vaccinated', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <Label htmlFor="vaccinated" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                Vaccinated
              </Label>
            </motion.div>

            {/* Medical History */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="medical_history" className="text-gray-700 dark:text-gray-300 font-medium">
                Medical History
              </Label>
              <textarea
                id="medical_history"
                value={data.medical_history}
                onChange={(e) => setData('medical_history', e.target.value)}
                className="w-full h-24 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 mt-2 resize-none"
                placeholder="Any previous medical conditions or treatments..."
                rows={3}
              />
              <InputError message={errors.medical_history} className="mt-1" />
            </motion.div>

            {/* Allergies */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <Label htmlFor="allergies" className="text-gray-700 dark:text-gray-300 font-medium">
                Allergies
              </Label>
              <Input
                id="allergies"
                value={data.allergies}
                onChange={(e) => setData('allergies', e.target.value)}
                placeholder="List any known allergies..."
                className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <InputError message={errors.allergies} className="mt-1" />
            </motion.div>

            {/* Grooming Notes */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="grooming_notes" className="text-gray-700 dark:text-gray-300 font-medium">
                Grooming Notes
              </Label>
              <textarea
                id="grooming_notes"
                value={data.grooming_notes}
                onChange={(e) => setData('grooming_notes', e.target.value)}
                className="w-full h-24 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 mt-2 resize-none"
                placeholder="Special grooming instructions or preferences..."
                rows={3}
              />
              <InputError message={errors.grooming_notes} className="mt-1" />
            </motion.div>

            {/* Last Groomed At */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <Label htmlFor="last_groomed_at" className="text-gray-700 dark:text-gray-300 font-medium">
                Last Groomed At
              </Label>
              <Input
                id="last_groomed_at"
                type="date"
                value={data.last_groomed_at}
                onChange={(e) => setData('last_groomed_at', e.target.value)}
                className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <InputError message={errors.last_groomed_at} className="mt-1" />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="pt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={processing}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Pet'
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}