import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

export default function TwoFactorChallenge() {
  const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const authConfigContent = useMemo<{
    title: string;
    description: string;
    toggleText: string;
    placeholder: string;
  }>(() => {
    if (showRecoveryInput) {
      return {
        title: 'Recovery Code',
        description:
          'Enter one of your emergency recovery codes to regain access.',
        toggleText: 'use authentication code instead',
        placeholder: 'Enter recovery code',
      };
    }

    return {
      title: 'Authentication Code',
      description:
        'Enter the 6-digit code from your authenticator app.',
      toggleText: 'use recovery code instead',
      placeholder: '',
    };
  }, [showRecoveryInput]);

  const toggleRecoveryMode = (clearErrors: () => void): void => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode('');
  };

  return (
    <AuthLayout
      title={authConfigContent.title}
      description={authConfigContent.description}
    >
      <Head title="Two-Factor Authentication" />

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
              {authConfigContent.title}
            </motion.h1>
            <motion.p
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {authConfigContent.description}
            </motion.p>
          </div>

          <Form
            {...store.form()}
            className="space-y-6"
            resetOnError
            resetOnSuccess={!showRecoveryInput}
          >
            {({ errors, processing, clearErrors }) => (
              <>

                {/* OTP or Recovery Input */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex justify-center"
                >
                  {showRecoveryInput ? (
                    <div className="w-full max-w-xs">
                      <Input
                        name="recovery_code"
                        type="text"
                        placeholder={authConfigContent.placeholder}
                        autoFocus
                        required
                        className="h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                      />
                      <InputError message={errors.recovery_code} className="mt-1 text-center" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3">
                      <InputOTP
                        name="code"
                        maxLength={OTP_MAX_LENGTH}
                        value={code}
                        onChange={(value) => setCode(value)}
                        disabled={processing}
                        pattern={REGEXP_ONLY_DIGITS}
                        autoFocus
                      >
                        <InputOTPGroup>
                          {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="w-12 h-12 text-lg font-semibold rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                      <InputError message={errors.code} className="text-sm" />
                    </div>
                  )}
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
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </motion.div>

                {/* Toggle Mode */}
                <motion.div
                  className="text-center text-sm text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <span>Or </span>
                  <button
                    type="button"
                    onClick={() => toggleRecoveryMode(clearErrors)}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none transition"
                  >
                    {authConfigContent.toggleText}
                  </button>
                </motion.div>
              </>
            )}
          </Form>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}