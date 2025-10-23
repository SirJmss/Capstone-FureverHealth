import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Create User', href: '/create' },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('users.store'));
    
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />
      <div className="w-8/12 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              required
              placeholder="First Name"
              value={data.first_name}
              onChange={(e) => setData('first_name', e.target.value)}
            />
            <InputError message={errors.first_name} />
          </div>

          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              required
              placeholder="Last Name"
              value={data.last_name}
              onChange={(e) => setData('last_name', e.target.value)}
            />
            <InputError message={errors.last_name} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
            />
            <InputError message={errors.email} />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="Phone number"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
            />
            <InputError message={errors.phone} />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
            />

          </div>

          <div>
            <Label htmlFor="user_type">User Type</Label>
            <select
              id="user_type"
              name="user_type"
              value={data.user_type}
              onChange={(e) => setData('user_type', e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="veterinary">Veterinary</option>
              <option value="groomer">Groomer</option>
            </select>
            <InputError message={errors.user_type} />
          </div>

          <Button type="submit" disabled={processing} className="mt-4">
            {processing ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
