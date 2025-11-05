import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { motion } from 'framer-motion';

export default function Register() {
  return (
    <AuthLayout
      title="Join FureverHealth"
      description="Create your account to manage your clinic with ease"
    >
      <Head title="Register" />

      <motion.div
        className="w-full max-w-lg"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Form
          {...RegisteredUserController.store.form()}
          resetOnSuccess={['password', 'password_confirmation']}
          disableWhileProcessing
          className="space-y-6"
        >
          {({ processing, errors }) => (
            <>
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="first_name" className="text-gray-700 dark:text-gray-300 font-medium">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="given-name"
                    name="first_name"
                    placeholder="John"
                    className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <InputError message={errors.first_name} className="mt-1" />
                </motion.div>

                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="last_name" className="text-gray-700 dark:text-gray-300 font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    type="text"
                    required
                    tabIndex={2}
                    autoComplete="family-name"
                    name="last_name"
                    placeholder="Doe"
                    className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <InputError message={errors.last_name} className="mt-1" />
                </motion.div>
              </div>

              {/* Email */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  tabIndex={3}
                  autoComplete="email"
                  name="email"
                  placeholder="vet@clinic.com"
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <InputError message={errors.email} className="mt-1" />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  tabIndex={4}
                  autoComplete="new-password"
                  name="password"
                  placeholder="Create a strong password"
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <InputError message={errors.password} className="mt-1" />
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  tabIndex={5}
                  autoComplete="new-password"
                  name="password_confirmation"
                  placeholder="Repeat your password"
                  className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <InputError message={errors.password_confirmation} className="mt-1" />
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Button
                  type="submit"
                  disabled={processing}
                  tabIndex={6}
                  data-test="register-user-button"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.div>

              {/* Login Link */}
              <motion.div
                className="text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                </span>
                <TextLink
                  href={login()}
                  className="font-semibold text-green-600 dark:text-green-400 hover:underline"
                  tabIndex={7}
                >
                  Log in
                </TextLink>
              </motion.div>
            </>
          )}
        </Form>
      </motion.div>
    </AuthLayout>
  );
}