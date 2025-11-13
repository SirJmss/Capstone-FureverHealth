import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react'; // Add this import

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { motion } from 'framer-motion';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false); // Add this state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Add this state for confirm password

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
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                    name="password"
                    placeholder="Create a strong password"
                    className="h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    tabIndex={5}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
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
                <div className="relative mt-2">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    tabIndex={6}
                    autoComplete="new-password"
                    name="password_confirmation"
                    placeholder="Repeat your password"
                    className="h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    tabIndex={7}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
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
                  tabIndex={8}
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
                  tabIndex={9}
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