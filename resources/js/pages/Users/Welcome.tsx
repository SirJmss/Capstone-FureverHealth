import { motion } from 'framer-motion';

export default function Welcome() {
    // Simulating the route and auth - in real implementation, these would come from Inertia
    const auth = { user: null };
    const route = (routeName: string) => `/${routeName}`;

    return (
        <div className="relative min-h-screen overflow-y-auto scroll-smooth font-sans text-[#2c2c2c]">
            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-white"></div>
                <div 
                    className="absolute inset-0 opacity-50"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F53003' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-orange-50/70 via-white to-orange-50/50"></div>
            </div>
            {/* NAVIGATION */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-100">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between lg:px-10">
                    <motion.div 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F53003] to-[#FF7B00] flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-2xl">🐾</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                        </div>
                        <div>
                            <span className="font-extrabold text-2xl bg-gradient-to-r from-[#F53003] to-[#FF7B00] bg-clip-text text-transparent tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>FurEver Health</span>
                            <p className="text-xs text-gray-500 font-medium">Pet Care Management</p>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="flex gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {auth.user ? (
                            <a
                                href={route('dashboard')}
                                className="rounded-full border-2 border-[#F53003] bg-white px-6 py-2.5 text-base font-semibold text-[#F53003] shadow-md transition-all hover:scale-105 hover:bg-[#F53003] hover:text-white"
                            >
                                Dashboard
                            </a>
                        ) : (
                            <>
                                <a
                                    href={route('login')}
                                    className="rounded-full px-6 py-2.5 text-base font-semibold text-[#2c2c2c] transition-all hover:scale-105 hover:text-[#F53003] hidden sm:block"
                                >
                                    Log in
                                </a>
                                <a
                                    href={route('register')}
                                    className="rounded-full bg-gradient-to-r from-[#F53003] to-[#FF7B00] px-8 py-2.5 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                                >
                                    Get Started
                                </a>
                            </>
                        )}
                    </motion.div>
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#fafaf8]" />
                    <motion.div 
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(data:image/svg+xml,%3Csvg width="1200" height="800" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23F53003;stop-opacity:0.3" /%3E%3Cstop offset="100%25" style="stop-color:%23FF7B00;stop-opacity:0.2" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="800" fill="url(%23grad)"/%3E%3C/svg%3E)'
                        }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 20, repeat: Infinity }}
                    />
                </div>

                <div className="container mx-auto px-6 lg:px-10 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                            FurEver Health
                        </h1>
                        <p className="text-xl lg:text-2xl text-white/90 mb-8 font-light">
                            Pet Grooming & Veterinary Management System
                        </p>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Bringing moments to life. Comprehensive digital care for your beloved pets.
                        </p>
                        <motion.a
                            href="#services"
                            className="inline-block"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center mx-auto">
                                <span className="text-white text-2xl">↓</span>
                            </div>
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* FILTER SECTION */}
            <section className="relative py-12 shadow-md border-t border-orange-100 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1920&q=80" 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50/90 via-white/95 to-red-50/90"></div>
                </div>
                
                <div className="container mx-auto px-6 lg:px-10 relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-8 text-[#2c2c2c]">Explore Our Services</h2>
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <select className="px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:border-[#F53003] transition-all">
                            <option>Select Service Type</option>
                            <option>Grooming</option>
                            <option>Veterinary Care</option>
                            <option>Appointments</option>
                        </select>
                        <select className="px-6 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:border-[#F53003] transition-all">
                            <option>Pet Type</option>
                            <option>Dogs</option>
                            <option>Cats</option>
                            <option>Birds</option>
                            <option>Other</option>
                        </select>
                        <button className="px-10 py-3 rounded-full bg-[#F53003] text-white font-semibold hover:bg-[#e62c00] transition-all hover:scale-105">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION - Flowing Design */}
            <section id="services" className="py-20 relative bg-gradient-to-b from-orange-50/30 via-red-50/20 to-amber-50/30">
                <div className="container mx-auto px-6 lg:px-10">
                    {/* Service 1 */}
                    <motion.div
                        className="relative mb-32"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" 
                                    alt="Happy dog" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-white text-lg font-medium">Comprehensive Pet Care</p>
                                </div>
                            </div>
                            <div>
                                <div className="inline-block px-4 py-2 bg-[#F53003]/10 rounded-full mb-4">
                                    <span className="text-[#F53003] font-semibold">About Us</span>
                                </div>
                                <h3 className="text-4xl font-bold mb-6 text-[#2c2c2c]">
                                    FurEver Health System
                                </h3>
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    FurEver Health is a digital system designed to help veterinary clinics and grooming centers manage their services in an organized and efficient way. As pets have become important members of the family, it's essential to have a system that ensures their medical and grooming needs are well-monitored, recorded, and scheduled.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    We solve the problems of manual or paper-based processes that often lead to misplaced records, delays in appointments, slower transactions, and difficulty tracking pet services.
                                </p>
                            </div>
                        </div>
                        <div className="absolute -right-12 top-1/2 w-64 h-64 bg-[#F53003]/5 rounded-full blur-3xl -z-10" />
                    </motion.div>

                    {/* Service 2 */}
                    <motion.div
                        className="relative mb-32"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="inline-block px-4 py-2 bg-[#F53003]/10 rounded-full mb-4">
                                    <span className="text-[#F53003] font-semibold">⚙️ Features</span>
                                </div>
                                <h3 className="text-4xl font-bold mb-6 text-[#2c2c2c]">
                                    System Features
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        '👤 User Management — Secure registration and role control',
                                        '🐶 Pet Management — Manage multiple pets per owner with detailed profiles',
                                        '📅 Appointment Management — Smart booking system with real-time updates',
                                        '👨‍🔧 Staff Management — Track staff schedules and roles efficiently',
                                        '🕒 Schedule Management — Real-time staff availability monitoring',
                                        '🔐 Authentication — Powered by Laravel Fortify for secure access',
                                    ].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <span className="text-gray-700">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80" 
                                    alt="Cat portrait" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-white text-lg font-medium">Smart Management Features</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -left-12 top-1/2 w-64 h-64 bg-[#FF7B00]/5 rounded-full blur-3xl -z-10" />
                    </motion.div>

                    {/* Service 3 */}
                    <motion.div
                        className="relative mb-32"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80" 
                                    alt="Rabbit" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-white text-lg font-medium">Built with Modern Technology</p>
                                </div>
                            </div>
                            <div>
                                <div className="inline-block px-4 py-2 bg-[#F53003]/10 rounded-full mb-4">
                                    <span className="text-[#F53003] font-semibold">🧱 Architecture</span>
                                </div>
                                <h3 className="text-4xl font-bold mb-6 text-[#2c2c2c]">
                                    System Architecture
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Frontend', value: 'Inertia.js + React' },
                                        { label: 'Backend', value: 'Laravel 12 (PHP 8.2)' },
                                        { label: 'Database', value: 'MySQL' },
                                        { label: 'ORM', value: 'Eloquent' },
                                        { label: 'Auth', value: 'Laravel Fortify' },
                                        { label: 'Server', value: 'Apache (XAMPP/LAMP)' },
                                    ].map((tech, i) => (
                                        <motion.div
                                            key={i}
                                            className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-[#F53003]"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="text-sm text-gray-500 mb-1">{tech.label}</div>
                                            <div className="font-semibold text-gray-800">{tech.value}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-12 top-1/2 w-64 h-64 bg-[#F53003]/5 rounded-full blur-3xl -z-10" />
                    </motion.div>

                    {/* Service 4 */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="inline-block px-4 py-2 bg-[#F53003]/10 rounded-full mb-4">
                                    <span className="text-[#F53003] font-semibold">🎯 Goals</span>
                                </div>
                                <h3 className="text-4xl font-bold mb-6 text-[#2c2c2c]">
                                    Goals of the System
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        'Provide a digital alternative to manual bookings and paper records',
                                        'Reduce human error and improve operational efficiency',
                                        'Offer admins real-time insights into daily operations',
                                        'Enhance data reliability, security, and accessibility',
                                        'Ensure consistent and timely pet care services',
                                    ].map((goal, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-start gap-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#F53003] flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="text-white font-bold">{i + 1}</span>
                                            </div>
                                            <p className="text-lg text-gray-700">{goal}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80" 
                                    alt="Bird" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-white text-lg font-medium">Achieving Excellence Together</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -left-12 top-1/2 w-64 h-64 bg-[#FF7B00]/5 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-4 text-[#2c2c2c]">Why Choose FurEver Health?</h2>
                        <p className="text-xl text-gray-600">Comprehensive care for every pet, every time</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '🏥', title: 'For Veterinary Clinics', desc: 'Streamline operations with automated scheduling, organized records, and better staff coordination.' },
                            { icon: '👨‍⚕️', title: 'For Veterinarians & Staff', desc: 'Access complete pet histories instantly, reduce paperwork, and focus more on quality care.' },
                            { icon: '👥', title: 'For Pet Owners', desc: 'Easy appointment booking, real-time updates, and peace of mind knowing your pet\'s care is documented.' },
                            { icon: '🐾', title: 'For Your Pets', desc: 'Consistent grooming schedules, complete medical records, and better health outcomes.' },
                            { icon: '📊', title: 'Data-Driven Insights', desc: 'Generate reports to monitor clinic performance and make informed decisions.' },
                            { icon: '🔒', title: 'Secure & Reliable', desc: 'Protected data storage with user authentication and access control.' },
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="text-5xl mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-[#2c2c2c]">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#F53003] to-[#FF7B00] rounded-b-2xl" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F53003] to-[#FF7B00]" />
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 1200 800">
                        <circle cx="100" cy="100" r="150" fill="white" />
                        <circle cx="1100" cy="700" r="200" fill="white" />
                        <circle cx="600" cy="400" r="100" fill="white" />
                    </svg>
                </div>
                
                <div className="container mx-auto px-6 lg:px-10 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-5xl font-bold mb-6 text-white">
                            Ready to Give Your Pet the Best Care?
                        </h2>
                        <p className="text-xl text-white/90 mb-10 leading-relaxed">
                            Join FurEver Health today and experience a better way to manage your pet's grooming and veterinary needs.
                        </p>
                        <a
                            href={route('register')}
                            className="inline-block rounded-full bg-white px-16 py-5 text-xl font-semibold text-[#F53003] shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
                        >
                            Get Started Now
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#2c2c2c] text-white py-12">
                <div className="container mx-auto px-6 lg:px-10 text-center">
                    <div className="mb-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#F53003] flex items-center justify-center">
                                <span className="text-white font-bold text-xl">🐾</span>
                            </div>
                            <span className="font-bold text-xl">FurEver Health</span>
                        </div>
                        <p className="text-gray-400">Pet Grooming & Veterinary Management System</p>
                    </div>
                    <div className="border-t border-gray-700 pt-6">
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} FurEver Health Grooming and Veterinary Management System. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}