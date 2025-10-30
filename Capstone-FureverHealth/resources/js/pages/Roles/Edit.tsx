import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

/* -------------------------------------------------
   COLOR PALETTE & HASH FUNCTION
------------------------------------------------- */
const colors = [
  'bg-red-100 text-red-700 border-red-300',
  'bg-yellow-100 text-yellow-700 border-yellow-300',
  'bg-green-100 text-green-700 border-green-300',
  'bg-blue-100 text-blue-700 border-blue-300',
  'bg-indigo-100 text-indigo-700 border-indigo-300',
  'bg-purple-100 text-purple-700 border-purple-300',
  'bg-pink-100 text-pink-700 border-pink-300',
  'bg-orange-100 text-orange-700 border-orange-300',
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
interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface EditProps {
  role: Role;
  allPermissions: string[];
}

/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Roles', href: '/roles' },
  { title: 'Edit Role', href: '' },
];

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function Edit({ role, allPermissions }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: role.name || '',
    permissions: role.permissions || [],
  });

  const togglePermission = (permission: string) => {
    if (data.permissions.includes(permission)) {
      setData(
        'permissions',
        data.permissions.filter((p) => p !== permission)
      );
    } else {
      setData('permissions', [...data.permissions, permission]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('roles.update', role.id)); // ✅ Update request
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Role - ${role.name}`} />

      <motion.div
        className="p-8 min-h-[80vh] flex flex-col items-center bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* ---------- HEADER ---------- */}
        <motion.div
          className="flex justify-between items-center w-full max-w-3xl mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
            Edit Role – {role.name}
          </h1>

          <Link href={route('roles.index')}>
            <Button
              variant="outline"
              className="transition-all duration-300 hover:scale-105 hover:shadow-sm"
            >
              Back
            </Button>
          </Link>
        </motion.div>

        {/* ---------- FORM CARD ---------- */}
        <motion.div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ---- ROLE NAME ---- */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Role Name
              </Label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Moderator"
                required
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50"
                disabled={processing}
              />
              <InputError message={errors.name} className="mt-1" />
            </div>

            {/* ---- PERMISSIONS ---- */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">
                Assign Permissions
              </Label>

              {allPermissions.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No permissions available.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allPermissions.map((perm) => {
                    const isSelected = data.permissions.includes(perm);
                    const color = getColorClass(perm);

                    return (
                      <motion.label
                        key={perm}
                        className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all select-none
                          ${isSelected
                            ? 'bg-blue-50 border-blue-500 shadow-sm'
                            : `border ${color
                                .replace('bg-', 'hover:bg-')
                                .replace('text-', 'hover:text-')}`}`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          value={perm}
                          checked={isSelected}
                          onChange={() => togglePermission(perm)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          disabled={processing}
                        />
                        <span
                          className={`text-sm font-medium truncate px-2 py-1 rounded-full transition-all
                            ${isSelected ? 'bg-blue-100 text-blue-700' : color}`}
                        >
                          {perm}
                        </span>
                      </motion.label>
                    );
                  })}
                </div>
              )}

              <InputError message={errors.permissions} className="mt-1" />
            </div>

            {/* ---- SUBMIT ---- */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
