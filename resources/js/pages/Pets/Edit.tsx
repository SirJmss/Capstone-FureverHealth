import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { PawPrint, ChevronLeft, Save, Calendar, Scale, Heart, AlertCircle, Scissors } from 'lucide-react';

interface Pet {
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
}

interface Props {
  pet: Pet;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pets', href: '/pets' },
  { title: 'Edit Pet', href: '' },
];

export default function EditPet({ pet }: Props) {
  const { data, setData, put, processing, errors } = useForm({
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
    put(route('pets.update', pet.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Pet: ${pet.name}`} />

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PawPrint className="w-8 h-8 text-teal-600" />
                Edit Pet
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Update {pet.name}'s information
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button - Mobile */}
        <div className="sm:hidden mb-6">
          <Link href={route('pets.index')}>
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
            <Link href={route('pets.index')}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Pets
              </motion.button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name & Species */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <PawPrint className="w-3.5 h-3.5" />
                  Pet Name *
                </Label>
                <Input
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Buddy"
                  className="h-11 rounded-lg text-sm"
                  required
                />
                <InputError message={errors.name || ''} />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Heart className="w-3.5 h-3.5" />
                  Species
                </Label>
                <Input
                  value={data.species}
                  onChange={e => setData('species', e.target.value)}
                  placeholder="Dog, Cat, Rabbit..."
                  className="h-11 rounded-lg text-sm"
                />
                <InputError message={errors.species || ''} />
              </div>
            </div>

            {/* Breed & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <PawPrint className="w-3.5 h-3.5" />
                  Breed
                </Label>
                <Input
                  value={data.breed}
                  onChange={e => setData('breed', e.target.value)}
                  placeholder="Golden Retriever"
                  className="h-11 rounded-lg text-sm"
                />
                <InputError message={errors.breed || ''} />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  Gender
                </Label>
                <select
                  value={data.gender}
                  onChange={e => setData('gender', e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <InputError message={errors.gender || ''} />
              </div>
            </div>

            {/* Age & Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  Age (years)
                </Label>
                <Input
                  type="number"
                  value={data.age}
                  onChange={e => setData('age', e.target.value)}
                  placeholder="3"
                  className="h-11 rounded-lg text-sm"
                />
                <InputError message={errors.age || ''} />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-sm">
                  <Scale className="w-3.5 h-3.5" />
                  Weight (kg)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.weight}
                  onChange={e => setData('weight', e.target.value)}
                  placeholder="25.5"
                  className="h-11 rounded-lg text-sm"
                />
                <InputError message={errors.weight || ''} />
              </div>
            </div>

            {/* Vaccinated */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition">
              <input
                type="checkbox"
                id="vaccinated"
                checked={data.vaccinated}
                onChange={e => setData('vaccinated', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
              />
              <Label htmlFor="vaccinated" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                Vaccinated
              </Label>
            </div>

            {/* Medical History */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <AlertCircle className="w-3.5 h-3.5" />
                Medical History
              </Label>
              <textarea
                value={data.medical_history}
                onChange={e => setData('medical_history', e.target.value)}
                placeholder="Any previous conditions or treatments..."
                className="w-full h-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm resize-none"
                rows={2}
              />
              <InputError message={errors.medical_history || ''} />
            </div>

            {/* Allergies */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <AlertCircle className="w-3.5 h-3.5" />
                Allergies
              </Label>
              <Input
                value={data.allergies}
                onChange={e => setData('allergies', e.target.value)}
                placeholder="List any known allergies..."
                className="h-11 rounded-lg text-sm"
              />
              <InputError message={errors.allergies || ''} />
            </div>

            {/* Grooming Notes */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Scissors className="w-3.5 h-3.5" />
                Grooming Notes
              </Label>
              <textarea
                value={data.grooming_notes}
                onChange={e => setData('grooming_notes', e.target.value)}
                placeholder="Special grooming preferences..."
                className="w-full h-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm resize-none"
                rows={2}
              />
              <InputError message={errors.grooming_notes || ''} />
            </div>

            {/* Last Groomed At */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                Last Groomed At
              </Label>
              <Input
                type="date"
                value={data.last_groomed_at}
                onChange={e => setData('last_groomed_at', e.target.value)}
                className="h-11 rounded-lg text-sm"
              />
              <InputError message={errors.last_groomed_at || ''} />
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
                    Update Pet
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