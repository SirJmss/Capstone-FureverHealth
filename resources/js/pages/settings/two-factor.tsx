import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface TwoFactorProps {
  requiresConfirmation?: boolean;
  twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Two-Factor Authentication',
    href: show.url(),
  },
];

export default function TwoFactor({
  requiresConfirmation = false,
  twoFactorEnabled = false,
}: TwoFactorProps) {
  const {
    qrCodeSvg,
    hasSetupData,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
  } = useTwoFactorAuth();
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Two-Factor Authentication" />

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
                Two-Factor Authentication
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Add an extra layer of security to your account.
              </motion.p>
            </div>

            {twoFactorEnabled ? (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Enabled State */}
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500 text-white font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    Enabled
                  </Badge>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Two-factor authentication is <strong>active</strong>. You’ll be prompted for a secure code from your authenticator app during login.
                </p>

                {/* Recovery Codes */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <TwoFactorRecoveryCodes
                    recoveryCodesList={recoveryCodesList}
                    fetchRecoveryCodes={fetchRecoveryCodes}
                    errors={errors}
                  />
                </motion.div>

                {/* Disable Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Form {...disable.form()}>
                    {({ processing }) => (
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={processing}
                        className="h-12 px-6 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                      >
                        {processing ? (
                          <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Disabling...
                          </>
                        ) : (
                          <>
                            <ShieldBan className="w-5 h-5" />
                            Disable 2FA
                          </>
                        )}
                      </Button>
                    )}
                  </Form>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Disabled State */}
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500 text-white font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldBan className="w-4 h-4" />
                    Disabled
                  </Badge>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Enable two-factor authentication to protect your account with a one-time code from your phone.
                </p>

                {/* Enable Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {hasSetupData ? (
                    <Button
                      onClick={() => setShowSetupModal(true)}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Continue Setup
                    </Button>
                  ) : (
                    <Form
                      {...enable.form()}
                      onSuccess={() => setShowSetupModal(true)}
                    >
                      {({ processing }) => (
                        <Button
                          type="submit"
                          disabled={processing}
                          className="h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                        >
                          {processing ? (
                            <>
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              Enabling...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-5 h-5" />
                              Enable 2FA
                            </>
                          )}
                        </Button>
                      )}
                    </Form>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Setup Modal */}
            <TwoFactorSetupModal
              isOpen={showSetupModal}
              onClose={() => {
                setShowSetupModal(false);
                clearSetupData();
              }}
              requiresConfirmation={requiresConfirmation}
              twoFactorEnabled={twoFactorEnabled}
              qrCodeSvg={qrCodeSvg}
              manualSetupKey={manualSetupKey}
              clearSetupData={clearSetupData}
              fetchSetupData={fetchSetupData}
              errors={errors}
            />
          </motion.div>
        </motion.div>
      </SettingsLayout>
    </AppLayout>
  );
}