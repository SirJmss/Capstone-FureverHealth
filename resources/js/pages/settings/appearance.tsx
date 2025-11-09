import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Appearance Settings',
    href: editAppearance().url,
  },
];

export default function Appearance() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Appearance Settings" />

      <SettingsLayout>
        <motion.div
          className="p-4 md:p-6 flex items-center justify-center min-h-[70vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="mb-8">
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Appearance Settings
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Customize how your dashboard looks and feels.
              </motion.p>
            </div>

            {/* Tabs */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AppearanceTabs />
            </motion.div>
          </motion.div>
        </motion.div>
      </SettingsLayout>
    </AppLayout>
  );
}