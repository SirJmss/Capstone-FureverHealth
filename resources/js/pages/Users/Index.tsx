import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type User = {
  id: number;
  name: string;
  email: string;
  adress: string;
  user_type: string;
  phone: string;
  is_active: boolean;
};

type Props = {
  users: User[];
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/users',
  },
];

export default function Index({ users }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      <div className="p-6"> {/* ✅ Proper padding container */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">User List</h1>
          <button className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            Create
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Address</th>
                <th className="border px-4 py-2 text-left">User Type</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.adress}</td>
                  <td className="border px-4 py-2">{user.user_type}</td>
                  <td className="border px-4 py-2">{user.phone}</td>
                  <td className="border px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white font-medium ${
                        user.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
