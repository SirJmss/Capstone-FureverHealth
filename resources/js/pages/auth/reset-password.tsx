import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { motion } from 'framer-motion';

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your new password below to regain access."
    >
      <Head title="Reset Password" />

      <motion.div
        className="flex items-center justify-center min-h-[70vh] p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Reset Your Password
            </motion.h1>
            <motion.p
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Enter a secure new password below.
            </motion.p>
          </div>

          <Form
            {...NewPasswordController.store.form()}
            transform={(data) => ({ ...data, token, email })}
            resetOnSuccess={['password', 'password_confirmation']}
          >
            {({ processing, errors }) => (
              <div className="space-y-6">

                {/* Email (Read-only) */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    readOnly
                    className="mt-2 h-12 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  />
                  <InputError message={errors.email} className="mt-1" />
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
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Enter strong password"
                    className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
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
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <InputError message={errors.password_confirmation} className="mt-1" />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  className="pt-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    data-test="reset-password-button"
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </motion.div>
              </div>
            )}
          </Form>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}