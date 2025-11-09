import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/password';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Password Settings',
    href: edit().url,
  },
];

export default function Password() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Password Settings" />

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
                Update Password
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Use a strong, unique password to keep your account secure.
              </motion.p>
            </div>

            <Form
              {...PasswordController.update.form()}
              options={{ preserveScroll: true }}
              resetOnError={['password', 'password_confirmation', 'current_password']}
              resetOnSuccess
              onError={(errors) => {
                if (errors.password) passwordInput.current?.focus();
                if (errors.current_password) currentPasswordInput.current?.focus();
              }}
              className="space-y-6"
            >
              {({ errors, processing, recentlySuccessful }) => (
                <>
                  {/* Current Password */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Label htmlFor="current_password" className="text-gray-700 dark:text-gray-300 font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="current_password"
                      ref={currentPasswordInput}
                      name="current_password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter current password"
                      className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <InputError message={errors.current_password} className="mt-1" />
                  </motion.div>

                  {/* New Password */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                      New Password
                    </Label>
                    <Input
                      id="password"
                      ref={passwordInput}
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <InputError message={errors.password} className="mt-1" />
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300 font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat new password"
                      className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                  </motion.div>

                  {/* Submit & Success */}
                  <motion.div
                    className="flex items-center gap-4 pt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      type="submit"
                      disabled={processing}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                      data-test="update-password-button"
                    >
                      {processing ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>

                    <motion.p
                      className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: recentlySuccessful ? 1 : 0, scale: recentlySuccessful ? 1 : 0.8 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Password Updated
                    </motion.p>
                  </motion.div>
                </>
              )}
            </Form>
          </motion.div>
        </motion.div>
      </SettingsLayout>
    </AppLayout>
  );
}