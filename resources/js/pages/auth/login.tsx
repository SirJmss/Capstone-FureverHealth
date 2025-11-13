import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react'; // Add this import

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false); // Add this state

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-emerald-50 to-pink-100 dark:from-gray-900 dark:via-teal-900 dark:to-purple-900">
      {/* ANIMATED ANIMAL PARADE - FULLY PLAYFUL */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* DOG - BEGGING (like your image) */}
        <motion.div
          className="absolute top-20 left-10 w-36 h-36"
          animate={{
            x: [0, 200, 500, 800, 1200],
            y: [0, -60, -100, -40, 0],
            rotate: [0, 10, -8, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.svg
            viewBox="0 0 140 140"
            className="drop-shadow-2xl"
            animate={{ rotate: [0, 5, -5, 5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            {/* Body */}
            <ellipse cx="70" cy="90" rx="45" ry="35" fill="#F4A460" stroke="#D2691E" strokeWidth="3" />
            {/* Head */}
            <circle cx="95" cy="70" r="28" fill="#F4A460" stroke="#D2691E" strokeWidth="3" />
            {/* Ears */}
            <path d="M80 50 Q70 35 75 25 Q85 30 90 45 Z" fill="#F4A460" stroke="#D2691E" strokeWidth="2" />
            <path d="M110 50 Q120 35 115 25 Q105 30 100 45 Z" fill="#F4A460" stroke="#D2691E" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="85" cy="65" r="7" fill="#333" />
            <circle cx="105" cy="65" r="7" fill="#333" />
            <circle cx="87" cy="64" r="2" fill="white" />
            <circle cx="107" cy="64" r="2" fill="white" />
            {/* Nose */}
            <circle cx="115" cy="75" r="5" fill="#000" />
            {/* Tongue */}
            <motion.ellipse
              cx="115" cy="82"
              rx="6" ry="10"
              fill="#FF69B4"
              animate={{ ry: [10, 12, 10] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            {/* Collar */}
            <ellipse cx="95" cy="85" rx="20" ry="8" fill="#FF4500" />
            {/* Front Leg (raised) */}
            <motion.rect
              x="75" y="105" width="15" height="30" rx="7"
              fill="#F4A460" stroke="#D2691E" strokeWidth="2"
              animate={{ rotate: [-30, -20, -30] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              style={{ transformOrigin: "82.5px 105px" }}
            />
            {/* Back Leg */}
            <rect x="55" y="110" width="15" height="25" rx="7" fill="#F4A460" stroke="#D2691E" strokeWidth="2" />
            {/* Tail */}
            <motion.path
              d="M25 90 Q10 70 20 50"
              stroke="#F4A460"
              strokeWidth="12"
              fill="none"
              animate={{ d: ["M25 90 Q10 70 20 50", "M25 90 Q5 65 15 45", "M25 90 Q10 70 20 50"] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </motion.svg>
        </motion.div>

        {/* CAT - PLAYFUL JUMP */}
        <motion.div
          className="absolute top-32 right-20 w-32 h-32"
          animate={{
            x: [-300, 0, 300, 600, 1000],
            y: [0, -120, -80, -140, 0],
            rotate: [0, -25, 15, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.svg
            viewBox="0 0 130 130"
            className="drop-shadow-2xl"
            animate={{ rotate: [0, 8, -8, 8, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <ellipse cx="65" cy="85" rx="40" ry="30" fill="#FFA500" stroke="#CC8400" strokeWidth="3" />
            <circle cx="90" cy="65" r="25" fill="#FFA500" stroke="#CC8400" strokeWidth="3" />
            <path d="M75 45 Q65 30 70 20 Q80 25 85 40 Z" fill="#FFA500" stroke="#CC8400" strokeWidth="2" />
            <path d="M105 45 Q115 30 110 20 Q100 25 95 40 Z" fill="#FFA500" stroke="#CC8400" strokeWidth="2" />
            <circle cx="80" cy="60" r="6" fill="#333" />
            <circle cx="100" cy="60" r="6" fill="#333" />
            <circle cx="82" cy="59" r="2" fill="white" />
            <circle cx="102" cy="59" r="2" fill="white" />
            <path d="M90 75 Q85 80 90 80 Q95 80 90 75" stroke="#333" strokeWidth="2" fill="none" />
            <motion.rect
              x="50" y="105" width="12" height="25" rx="6"
              fill="#FFA500" stroke="#CC8400" strokeWidth="2"
              animate={{ rotate: [-15, 0, -15] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{ transformOrigin: "56px 105px" }}
            />
            <rect x="70" y="105" width="12" height="25" rx="6" fill="#FFA500" stroke="#CC8400" strokeWidth="2" />
            <motion.path
              d="M20 85 Q5 65 10 45"
              stroke="#FFA500"
              strokeWidth="10"
              fill="none"
              animate={{ d: ["M20 85 Q5 65 10 45", "M20 85 Q0 60 5 40"] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
          </motion.svg>
        </motion.div>

        {/* RABBIT - BOUNCY HOP */}
        <motion.div
          className="absolute bottom-24 left-32 w-30 h-30"
          animate={{
            x: [0, 150, 400, 700, 1000],
            y: [0, -100, -160, -80, 0],
            scale: [1, 1.3, 1.1, 1.3, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <svg viewBox="0 0 120 120" className="drop-shadow-2xl">
            <ellipse cx="60" cy="80" rx="38" ry="32" fill="#FFF" stroke="#EEE" strokeWidth="3" />
            <ellipse cx="45" cy="50" rx="16" ry="28" fill="#FFF" stroke="#EEE" strokeWidth="2" />
            <ellipse cx="75" cy="50" rx="16" ry="28" fill="#FFF" stroke="#EEE" strokeWidth="2" />
            <circle cx="50" cy="70" r="9" fill="#333" />
            <circle cx="70" cy="70" r="9" fill="#333" />
            <circle cx="52" cy="69" r="3.5" fill="pink" />
            <circle cx="72" cy="69" r="3.5" fill="pink" />
            <path d="M55 85 Q60 90 65 85" stroke="#333" strokeWidth="2" fill="none" />
            <rect x="45" y="105" width="12" height="20" rx="6" fill="#FFF" stroke="#EEE" strokeWidth="2" />
            <rect x="65" y="105" width="12" height="20" rx="6" fill="#FFF" stroke="#EEE" strokeWidth="2" />
          </svg>
        </motion.div>

        {/* BIRD - FLAPPING WINGS */}
        <motion.div
          className="absolute top-12 left-1/4 w-24 h-24"
          animate={{
            x: [0, 100, 250, 100, 0],
            y: [0, -60, -100, -40, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 100 100" className="drop-shadow-xl">
            <motion.path
              d="M50 50 Q30 30 20 50 Q30 70 50 60 Q70 70 80 50 Q70 30 50 50"
              fill="#87CEEB"
              stroke="#4682B4"
              strokeWidth="2"
              animate={{ scaleY: [1, 0.7, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ transformOrigin: "50px 50px" }}
            />
            <circle cx="40" cy="45" r="5" fill="#333" />
            <path d="M60 50 L70 48 L65 45 Z" fill="#FF4500" />
          </svg>
        </motion.div>

        {/* HAMSTER - ROLLING BALL */}
        <motion.div
          className="absolute bottom-36 right-36 w-26 h-26"
          animate={{
            x: [-400, 0, 300, 600],
            y: [0, -40, -70, 0],
            rotate: [0, 720, 1440, 2160],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 100 100" className="drop-shadow-xl">
            <circle cx="50" cy="50" r="38" fill="#D2691E" stroke="#A0522D" strokeWidth="3" />
            <circle cx="40" cy="45" r="7" fill="#333" />
            <circle cx="60" cy="45" r="7" fill="#333" />
            <circle cx="42" cy="44" r="2.5" fill="white" />
            <circle cx="62" cy="44" r="2.5" fill="white" />
            <circle cx="50" cy="60" r="4" fill="#000" />
            <path d="M35 70 Q50 75 65 70" stroke="#333" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>

        {/* PUPPY - SPINNING */}
        <motion.div
          className="absolute top-48 left-1/3 w-20 h-20"
          animate={{
            x: [0, 150, 300],
            y: [0, -50, -20],
            rotate: [0, 720],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 80 80" className="drop-shadow-lg">
            <ellipse cx="40" cy="50" rx="25" ry="20" fill="#F4A460" stroke="#D2691E" strokeWidth="2" />
            <circle cx="55" cy="40" r="15" fill="#F4A460" stroke="#D2691E" strokeWidth="2" />
            <circle cx="50" cy="38" r="4" fill="#333" />
            <circle cx="60" cy="38" r="4" fill="#333" />
            <motion.path
              d="M20 50 Q10 40 15 30"
              stroke="#F4A460"
              strokeWidth="8"
              fill="none"
              animate={{ d: ["M20 50 Q10 40 15 30", "M20 50 Q5 35 10 25"] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </svg>
        </motion.div>

        {/* BUTTERFLY - DANCING */}
        <motion.div
          className="absolute top-16 right-1/4 w-24 h-24"
          animate={{
            x: [-150, 150, -150],
            y: [0, -60, 0],
            rotate: [0, 20, -20, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 100 100" className="drop-shadow-xl">
            <motion.path
              d="M50 50 Q30 30 40 20 Q50 30 60 20 Q70 30 50 50"
              fill="#FF69B4"
              stroke="#C71585"
              strokeWidth="2"
              animate={{ d: ["M50 50 Q30 30 40 20 Q50 30 60 20 Q70 30 50 50", "M50 50 Q25 25 35 15 Q50 25 65 15 Q75 25 50 50"] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
            <motion.path
              d="M50 50 Q30 70 40 80 Q50 70 60 80 Q70 70 50 50"
              fill="#9370DB"
              stroke="#6A5ACD"
              strokeWidth="2"
              animate={{ d: ["M50 50 Q30 70 40 80 Q50 70 60 80 Q70 70 50 50", "M50 50 Q25 75 35 85 Q50 75 65 85 Q75 75 50 50"] }}
              transition={{ duration: 0.3, repeat: Infinity, delay: 0.15 }}
            />
            <circle cx="50" cy="50" r="5" fill="#333" />
          </svg>
        </motion.div>

        {/* GOLDEN RETRIEVER - WAGGING */}
        <motion.div
          className="absolute bottom-28 right-12 w-38 h-38"
          animate={{
            x: [-500, 0, 400, 800],
            y: [0, -70, -30, 0],
            rotate: [0, -12, 10, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.svg
            viewBox="0 0 150 150"
            className="drop-shadow-2xl"
            animate={{ rotate: [0, 6, -6, 6, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          >
            <ellipse cx="75" cy="95" rx="48" ry="35" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
            <circle cx="100" cy="75" r="30" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
            <path d="M85 55 Q75 40 80 30 Q90 35 95 50 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            <path d="M115 55 Q125 40 120 30 Q110 35 105 50 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            <circle cx="90" cy="70" r="8" fill="#333" />
            <circle cx="110" cy="70" r="8" fill="#333" />
            <circle cx="92" cy="68" r="3" fill="white" />
            <circle cx="112" cy="68" r="3" fill="white" />
            <circle cx="120" cy="80" r="5" fill="#000" />
            <motion.ellipse cx="120" cy="87" rx="6" ry="10" fill="#FF69B4" animate={{ ry: [10, 13, 10] }} transition={{ duration: 0.9, repeat: Infinity }} />
            <rect x="55" y="115" width="15" height="30" rx="7" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            <rect x="95" y="115" width="15" height="30" rx="7" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            <motion.path
              d="M25 95 Q5 75 15 55"
              stroke="#FFD700"
              strokeWidth="14"
              fill="none"
              animate={{ d: ["M25 95 Q5 75 15 55", "M25 95 Q0 70 10 50", "M25 95 Q5 75 15 55"] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.svg>
        </motion.div>

        {/* PARROT - SQUAWK */}
        <motion.div
          className="absolute top-40 right-1/3 w-28 h-28"
          animate={{
            x: [-200, 100, 400],
            y: [0, -80, -40],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 110 110" className="drop-shadow-xl">
            <path d="M55 55 Q35 35 25 55 Q35 75 55 65 Q75 75 85 55 Q75 35 55 55" fill="#32CD32" stroke="#228B22" strokeWidth="3" />
            <path d="M85 55 Q95 45 90 35" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            <circle cx="45" cy="50" r="7" fill="#333" />
            <circle cx="65" cy="50" r="7" fill="#333" />
            <motion.path
              d="M40 65 Q55 70 70 65"
              stroke="#333"
              strokeWidth="3"
              fill="none"
              animate={{ d: ["M40 65 Q55 70 70 65", "M40 65 Q55 75 70 65"] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          </svg>
        </motion.div>

        {/* FERRET - SLINKING */}
        <motion.div
          className="absolute bottom-40 left-1/4 w-32 h-32"
          animate={{
            x: [0, 300, 600, 900],
            y: [0, -20, -40, -10, 0],
            rotate: [0, 5, -5, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 130 130" className="drop-shadow-xl">
            <path d="M40 70 Q30 65 25 70 Q20 75 25 80 Q30 85 40 80 Q50 75 40 70 M90 70 Q100 65 105 70 Q110 75 105 80 Q100 85 90 80 Q80 75 90 70 M65 60 Q60 55 55 60 Q50 65 55 70 Q60 75 65 70 Q70 65 75 60 Q70 55 65 60" fill="#8B4513" stroke="#654321" strokeWidth="2" />
            <circle cx="50" cy="65" r="5" fill="#333" />
            <circle cx="80" cy="65" r="5" fill="#333" />
            <path d="M40 80 L35 90 L45 90 Z M90 80 L85 90 L95 90 Z" fill="#8B4513" />
          </svg>
        </motion.div>

      </div>

      {/* LOGIN FORM - ON TOP */}
      <AuthLayout
        title="Welcome back"
        description="Log in to continue to your FureverHealth dashboard"
      >
        <Head title="Log in" />

        <motion.div
          className="relative z-30 w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/40 dark:border-gray-700"
          initial={{ scale: 0.9, opacity: 0, y: 60 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <Form
            {...AuthenticatedSessionController.store.form()}
            resetOnSuccess={['password']}
            className="space-y-6"
          >
            {({ processing, errors }) => (
              <>
                <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <Label htmlFor="email" className="text-gray-800 dark:text-gray-200 font-bold text-lg">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoFocus
                    tabIndex={1}
                    placeholder="vet@clinic.com"
                    className="mt-2 h-14 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500"
                  />
                  <InputError message={errors.email} className="mt-1" />
                </motion.div>

                <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-800 dark:text-gray-200 font-bold text-lg">
                      Password
                    </Label>
                    {canResetPassword && (
                      <TextLink href={request()} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Forgot?
                      </TextLink>
                    )}
                  </div>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      tabIndex={2}
                      placeholder="••••••••"
                      className="h-14 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      tabIndex={3}
                    >
                      {showPassword ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <InputError message={errors.password} className="mt-1" />
                </motion.div>

                <motion.div className="flex items-center space-x-3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <Checkbox id="remember" name="remember" tabIndex={4} className="w-6 h-6" />
                  <Label htmlFor="remember" className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Remember me
                  </Label>
                </motion.div>

                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
                  <Button
                    type="submit"
                    disabled={processing}
                    tabIndex={5}
                    className="w-full h-14 text-xl font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-xl hover:shadow-2xl"
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="w-6 h-6 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Log in'
                    )}
                  </Button>
                </motion.div>

                <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <span className="text-gray-600 dark:text-gray-400">No account? </span>
                  <TextLink href={register()} className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Sign up
                  </TextLink>
                </motion.div>
              </>
            )}
          </Form>

          {status && (
            <motion.div
              className="mt-6 p-4 bg-green-100 dark:bg-green-900/50 border-2 border-green-300 dark:border-green-700 rounded-xl text-center font-bold text-green-800 dark:text-green-300"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {status}
            </motion.div>
          )}
        </motion.div>
      </AuthLayout>
    </div>
  );
}