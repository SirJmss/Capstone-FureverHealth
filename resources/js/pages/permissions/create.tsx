import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Permissions', href: '/permissions' },
  { title: 'Create Permission', href: '/permissions/create' },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({ name: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('permissions.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Permission" />

      <motion.div
        className="p-8 min-h-[80vh] flex flex-col items-center bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div className="flex w-full max-w-3xl items-center justify-between mb-8" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-800">Create New Permission</h1>
          <Link href={route('permissions.index')}>
            <Button variant="outline">Back</Button>
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-lg border border-gray-100"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={submit} className="grid gap-6">
            <div>
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                placeholder="Enter Permission Name"
                required
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              <InputError message={errors.name} />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {processing ? 'Creating...' : 'Create Permission'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}