import { motion } from 'framer-motion';
import { PawPrint, Calendar, Users, Shield, Clock, ChevronRight, Star, CheckCircle, ArrowRight } from 'lucide-react';

export default function Welcome() {
  // Simulate auth & route
  const auth = { user: null };
  const route = (name: string) => `/${name}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans">

      {/* NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-gray-700">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                FurEver Health
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pet Care Management</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            {auth.user ? (
              <a
                href={route('dashboard')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm"
              >
                <Calendar className="w-4 h-4" />
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href={route('login')}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition hidden sm:block"
                >
                  Log in
                </a>
                <a
                  href={route('register')}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            )}
          </motion.div>
        </nav>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-cyan-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              FurEver Health
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Pet Grooming & Veterinary Management System
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Comprehensive digital care for your beloved pets — from grooming to veterinary services.
            </p>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.1 }}
              className="inline-block"
            >
              <div className="w-12 h-12 rounded-full border-2 border-teal-600 flex items-center justify-center mx-auto">
                <ChevronRight className="w-6 h-6 text-teal-600" />
              </div>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="py-12 bg-white dark:bg-gray-800 shadow-sm border-y border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Explore Our Services
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-3xl mx-auto">
            <select className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option>Select Service Type</option>
              <option>Grooming</option>
              <option>Veterinary Care</option>
              <option>Appointments</option>
            </select>
            <select className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option>Pet Type</option>
              <option>Dogs</option>
              <option>Cats</option>
              <option>Birds</option>
              <option>Other</option>
            </select>
            <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm">
              Search
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-32">

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-xl group">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" alt="Happy dog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-medium">Comprehensive Pet Care</p>
              </div>
            </div>
            <div>
              <span className="inline-block px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-4">
                About Us
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                FurEver Health System
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                A digital system designed to help veterinary clinics and grooming centers manage services efficiently.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Replace paper records, reduce delays, and ensure every pet gets timely, documented care.
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <span className="inline-block px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-4">
                Features
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                System Features
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Users, text: 'User Management — Secure roles & access' },
                  { icon: PawPrint, text: 'Pet Management — Full pet profiles' },
                  { icon: Calendar, text: 'Appointment Booking — Real-time' },
                  { icon: Clock, text: 'Staff Scheduling — Live availability' },
                  { icon: Shield, text: 'Laravel Fortify — Secure auth' },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <f.icon className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{f.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-xl group">
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80" alt="Cat" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-medium">Smart Management</p>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-xl group">
              <img src="https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80" alt="Rabbit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-medium">Modern Stack</p>
              </div>
            </div>
            <div>
              <span className="inline-block px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-4">
                Architecture
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Built with Modern Tech
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Frontend', value: 'React + Inertia' },
                  { label: 'Backend', value: 'Laravel 12' },
                  { label: 'Database', value: 'MySQL' },
                  { label: 'Auth', value: 'Fortify' },
                ].map((t, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-gray-800 rounded-xl border-l-4 border-teal-600 shadow-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.label}</div>
                    <div className="font-medium text-gray-800 dark:text-white">{t.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Choose FurEver Health?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Comprehensive care for every pet, every time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Star, title: 'For Clinics', desc: 'Streamline operations with automated scheduling and records.' },
              { icon: Users, title: 'For Staff', desc: 'Access pet histories instantly and reduce paperwork.' },
              { icon: CheckCircle, title: 'For Owners', desc: 'Easy booking and real-time updates for peace of mind.' },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all"
              >
                <b.icon className="w-10 h-10 text-teal-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{b.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-teal-600 to-cyan-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Ready to Give Your Pet the Best Care?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join FurEver Health and experience modern pet care management.
            </p>
            <a
              href={route('register')}
              className="inline-block px-12 py-4 rounded-xl bg-white text-teal-600 font-bold shadow-lg hover:shadow-2xl transition-all hover:scale-105 text-lg"
            >
              Get Started Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">FurEver Health</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Pet Grooming & Veterinary Management System
          </p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FurEver Health. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}