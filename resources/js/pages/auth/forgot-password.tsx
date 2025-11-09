// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
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

export default function ForgotPassword({ status }: { status?: string }) {
  return (
    <AuthLayout
      title="Forgot Your Password?"
      description="Enter your email to receive a secure password reset link."
    >
      <Head title="Forgot Password" />

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
              We’ll send a secure link to your inbox.
            </motion.p>
          </div>

          {/* Success Message */}
          {status && (
            <motion.div
              className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-center text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {status}
            </motion.div>
          )}

          <Form {...PasswordResetLinkController.store.form()}>
            {({ processing, errors }) => (
              <div className="space-y-6">

                {/* Email Field */}
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
                    autoFocus
                    placeholder="you@example.com"
                    className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <InputError message={errors.email} className="mt-1" />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  className="pt-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    data-test="email-password-reset-link-button"
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </motion.div>
              </div>
            )}
          </Form>

          {/* Back to Login */}
          <motion.div
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span>Remember your password? </span>
            <TextLink href={login()}>Log in</TextLink>
          </motion.div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}