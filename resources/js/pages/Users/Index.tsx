import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { can } from '@/lib/can';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  is_active: boolean;
  deleted_at: string | null;
  roles: string[]; // Added roles property
};

type AuthUser = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  roles: string[];
  permissions: string[];
};

type Props = {
  users: User[];
  auth: {
    user: AuthUser;
  };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

// Define role priority for sorting
const ROLE_PRIORITY: { [key: string]: number } = {
  'Admin': 1,
  'Veterinarian': 2,
  'Pet Groomer': 3,
  'Customer': 4
};

export default function Index({ users, auth }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [roleSort, setRoleSort] = useState<string>("all"); // "all", "Admin", "Customer", etc.

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
    setDeletingId(null);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    setDeletingId(userToDelete.id);
    router.delete(route('users.destroy', userToDelete.id), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        alert('Failed to delete user.');
        closeModal();
      },
    });
  };

  // Get the highest priority role for a user (lowest number = highest priority)
  const getPrimaryRole = (user: User): string => {
    if (!user.roles || user.roles.length === 0) return 'Customer';
    
    const rolesWithPriority = user.roles
      .map(role => ({ role, priority: ROLE_PRIORITY[role] || 999 }))
      .sort((a, b) => a.priority - b.priority);
    
    return rolesWithPriority[0]?.role || 'Customer';
  };

  // Fixed: Use filteredUsers instead of users in the table
  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    
    // First filter by search term
    let filtered = users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(term) ||
        user.last_name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );

    // Then filter by role if a specific role is selected
    if (roleSort !== "all") {
      filtered = filtered.filter(user => 
        user.roles && user.roles.includes(roleSort)
      );
    }

    // Then sort by ID and role
    return [...filtered].sort((a, b) => {
      if (sortOrder === "desc") {
        // For descending: newest first, then by role priority
        return b.id - a.id || ROLE_PRIORITY[getPrimaryRole(a)] - ROLE_PRIORITY[getPrimaryRole(b)];
      } else {
        // For ascending: oldest first, then by role priority
        return a.id - b.id || ROLE_PRIORITY[getPrimaryRole(a)] - ROLE_PRIORITY[getPrimaryRole(b)];
      }
    });
  }, [users, search, sortOrder, roleSort]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      {/* === DELETE MODAL === */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 shadow-2xl border border-white/20"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                Delete User
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Permanently delete{' '}
                <span className="font-semibold text-red-600">
                  {userToDelete?.first_name} {userToDelete?.last_name}
                </span>
                ? This action <span className="underline">cannot be undone</span>.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={deletingId !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm shadow-lg transition hover:from-red-600 hover:to-red-700 disabled:opacity-50"
                >
                  {deletingId ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MAIN CONTENT === */}
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Users Management
          </motion.h1>

          {can('users.create') && (
            <Link href={route('users.create')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create User
              </motion.button>
            </Link>
          )}
        </div>
        
        {/* Search + Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <div className="flex gap-2">
            <select
              value={roleSort}
              onChange={(e) => setRoleSort(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Veterinarian">Veterinarian</option>
              <option value="Pet Groomer">Pet Groomer</option>
              <option value="Customer">Customer</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm transition hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Sort: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>
        
        {/* Table Card */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                  {['ID', 'First Name', 'Last Name', 'Email', 'Roles', 'Status', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!filteredUsers.length ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 01-2 2H5a2 2 0 01-2-2 2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        No users found
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white align-middle">
                        #{user.id}
                      </td>

                      {/* First Name */}
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.first_name}
                        </span>
                      </td>

                      {/* Last Name */}
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.last_name}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 align-middle">
                        {user.email}
                      </td>

                      {/* Roles */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.map((role, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                role === 'Admin' 
                                  ? 'text-purple-600 dark:text-purple-400'
                                  : role === 'Veterinarian'
                                  ? 'text-green-600 dark:text-green-400'
                                  : role === 'Pet Groomer'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 align-middle">
                        <motion.span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                            user.is_active
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </motion.span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center justify-start gap-2">
                          {can('users.view') && (
                            <Link href={route('users.show', user.id)}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                title="View"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </motion.button>
                            </Link>
                          )}

                          {can('users.edit') && (
                            <Link href={route('users.edit', user.id)}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </motion.button>
                            </Link>
                          )}

                          {can('users.delete') && (
                            <motion.button
                              onClick={() => openDeleteModal(user)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}