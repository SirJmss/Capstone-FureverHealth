import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { motion } from "framer-motion";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

/* -------------------------------------------------
   TYPES
------------------------------------------------- */
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

interface ServiceProps {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  user_id: number;
  category_id: number;
  user: User;
  category: Category;
}

interface PageProps extends InertiaPageProps {
  service: ServiceProps;
  is_admin: boolean;
}

/* -------------------------------------------------
   BREADCRUMBS
------------------------------------------------- */
const breadcrumbs: BreadcrumbItem[] = [
  { title: "Services", href: "/services" },
  { title: "View Service", href: "" },
];

/* -------------------------------------------------
   HELPER: Format Currency
------------------------------------------------- */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

/* -------------------------------------------------
   HELPER: Format Duration
------------------------------------------------- */
const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
};

/* -------------------------------------------------
   HELPER: Get Role Names
------------------------------------------------- */
const getRoleNames = (user: User) => {
  return user.roles.map(role => role.name).join(', ');
};

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */
export default function ShowService() {
  const { service, is_admin } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Service - ${service.name}`} />

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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Service Details
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ID: #{service.id}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {service.category.name}
                </span>
              </div>
            </motion.div>

            <Link href={route("services.index")}>
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

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Service Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Service Information
                </h3>
                <div className="bg-gray-50/70 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Service Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {service.name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {service.category.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-xl">
                        {formatCurrency(service.price)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDuration(service.duration)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Provider Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Service Provider
                </h3>
                <div className="bg-gray-50/70 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {service.user.first_name} {service.user.last_name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Roles</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getRoleNames(service.user)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white break-all">
                        {service.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Service Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Service Description
                </h3>
                <div className="bg-gray-50/70 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  {service.description ? (
                    <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                      {service.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No description provided for this service.
                    </p>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Additional Details
                </h3>
                <div className="bg-gray-50/70 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Service ID</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">#{service.id}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Provider ID</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">#{service.user.id}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Category ID</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">#{service.category.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Compatibility Info */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">
                  Role Compatibility:
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• <strong>Pet Groomers</strong> → <strong>Grooming</strong> services</li>
                  <li>• <strong>Veterinarians</strong> → <strong>Treatment & Check-up</strong> services</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <motion.div
            className="flex justify-end gap-3 mt-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {is_admin && (
              <>
                <Link href={route("services.edit", service.id)}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Service
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}