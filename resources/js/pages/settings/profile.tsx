import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile Settings',
    href: edit().url,
  },
];

export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile Settings" />

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
                Profile Information
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Update your name, email, and phone number.
              </motion.p>
            </div>

            <Form
              {...ProfileController.update.form()}
              options={{ preserveScroll: true }}
              className="space-y-6"
            >
              {({ processing, recentlySuccessful, errors }) => (
                <>
                  {/* Name */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={auth.user.name}
                      required
                      autoComplete="name"
                      placeholder="John Doe"
                      className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <InputError message={errors.name} className="mt-1" />
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={auth.user.phone}
                      autoComplete="tel"
                      placeholder="+1 234 567 890"
                      className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <InputError message={errors.phone} className="mt-1" />
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      defaultValue={auth.user.email}
                      required
                      autoComplete="username"
                      placeholder="you@example.com"
                      className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <InputError message={errors.email} className="mt-1" />
                  </motion.div>

                  {/* Email Verification */}
                  {mustVerifyEmail && auth.user.email_verified_at === null && (
                    <motion.div
                      className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        Your email is <strong>unverified</strong>.{' '}
                        <Link
                          href={send()}
                          method="post"
                          as="button"
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Resend verification email
                        </Link>
                      </p>

                      {status === 'verification-link-sent' && (
                        <motion.p
                          className="mt-2 text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          A new verification link has been sent.
                        </motion.p>
                      )}
                    </motion.div>
                  )}

                  {/* Submit & Success */}
                  <motion.div
                    className="flex items-center gap-4 pt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                  >
                    <Button
                      type="submit"
                      disabled={processing}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                      data-test="update-profile-button"
                    >
                      {processing ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>

                    <motion.p
                      className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: recentlySuccessful ? 1 : 0, scale: recentlySuccessful ? 1 : 0.8 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Saved
                    </motion.p>
                  </motion.div>
                </>
              )}
            </Form>

            {/* Delete Account */}
            <motion.div
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <DeleteUser />
            </motion.div>
          </motion.div>
        </motion.div>
      </SettingsLayout>
    </AppLayout>
  );
}