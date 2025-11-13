import { motion } from 'framer-motion';

export default function Welcome() {
    // Simulating the route and auth - in real implementation, these would come from Inertia
    const auth = { user: null };
    const route = (name) => `/${name}`;

    return (
        <div className="relative min-h-screen overflow-y-auto scroll-smooth bg-gradient-to-b from-[#fff8f6] via-[#fff5f0] to-[#fff1e8] font-sans text-[#1b1b18]">
            {/* Floating background orbs */}
            <motion.div
                className="absolute top-10 left-10 h-80 w-80 rounded-full bg-[#F53003]/20 blur-3xl"
                animate={{ y: [0, 40, 0], x: [0, 25, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-[#FF7B00]/20 blur-3xl"
                animate={{ y: [0, -30, 0], x: [0, -25, 0] }}
                transition={{ duration: 12, repeat: Infinity }}
            />

            {/* NAVIGATION */}
            <header className="container mx-auto px-6 pt-8 lg:px-10">
                <nav className="flex justify-end gap-5">
                    {auth.user ? (
                        <a
                            href={route('dashboard')}
                            className="rounded-full border border-[#1b1b18]/10 bg-white px-6 py-2.5 text-base font-semibold text-[#1b1b18] shadow-md transition-all hover:scale-105 hover:border-[#F53003]/30 hover:text-[#F53003]"
                        >
                            Dashboard
                        </a>
                    ) : (
                        <>
                            <a
                                href={route('login')}
                                className="rounded-full px-6 py-2.5 text-base font-semibold text-[#1b1b18] transition-all hover:scale-105 hover:text-[#F53003]"
                            >
                                Log in
                            </a>
                            <a
                                href={route('register')}
                                className="rounded-full bg-[#F53003] px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-[#e62c00]"
                            >
                                Register
                            </a>
                        </>
                    )}
                </nav>
            </header>

            {/* HERO */}
            <main className="relative z-10 container mx-auto flex flex-col items-center justify-center px-6 py-24 text-center lg:flex-row lg:items-center lg:gap-24 lg:px-10 lg:text-left">
                {/* LEFT */}
                <div className="max-w-2xl">
                    <motion.h1
                        className="mb-6 text-6xl font-extrabold leading-tight lg:text-7xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Welcome to{' '}
                        <span className="text-[#F53003]">
                            FurEver Health
                        </span>
                    </motion.h1>

                    <motion.p
                        className="mb-10 text-lg leading-relaxed text-[#706f6c]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        A complete pet grooming and veterinary management system designed to ensure your pets receive consistent, timely care while making appointments and record-keeping effortless.
                    </motion.p>

                    <motion.a
                        href="#about"
                        className="inline-block rounded-full bg-[#F53003] px-12 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#d92a00]"
                        whileHover={{ scale: 1.05 }}
                    >
                        Learn More ↓
                    </motion.a>
                </div>

                {/* RIGHT - Animated Pets */}
                <motion.div
                    className="mt-16 w-full max-w-md lg:mt-0 lg:w-[500px]"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff2f2] to-[#fef5e7] p-10 shadow-2xl h-[400px]">
                        {/* Dog */}
                        <motion.svg
                            className="absolute"
                            style={{ left: '10%', top: '20%' }}
                            width="120"
                            height="120"
                            viewBox="0 0 120 120"
                            fill="none"
                            animate={{ 
                                y: [0, -10, 0],
                                rotate: [-5, 5, -5]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <ellipse cx="60" cy="80" rx="35" ry="25" fill="#D4A574" />
                            <ellipse cx="60" cy="50" rx="30" ry="28" fill="#D4A574" />
                            <ellipse cx="40" cy="40" rx="12" ry="20" fill="#B8956A" />
                            <ellipse cx="80" cy="40" rx="12" ry="20" fill="#B8956A" />
                            <circle cx="52" cy="48" r="5" fill="#333" />
                            <circle cx="68" cy="48" r="5" fill="#333" />
                            <circle cx="60" cy="58" r="4" fill="#333" />
                            <path d="M60 60 Q55 65 50 62 M60 60 Q65 65 70 62" stroke="#333" strokeWidth="2" fill="none" />
                            <path d="M90 75 Q100 70 105 80" stroke="#D4A574" strokeWidth="8" fill="none" strokeLinecap="round" />
                        </motion.svg>

                        {/* Cat */}
                        <motion.svg
                            className="absolute"
                            style={{ right: '15%', top: '15%' }}
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            fill="none"
                            animate={{ 
                                y: [0, -8, 0],
                                rotate: [3, -3, 3]
                            }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        >
                            <ellipse cx="50" cy="65" rx="28" ry="20" fill="#FFB366" />
                            <circle cx="50" cy="40" r="22" fill="#FFB366" />
                            <path d="M32 30 L28 15 L38 28 Z" fill="#FFB366" />
                            <path d="M68 30 L72 15 L62 28 Z" fill="#FFB366" />
                            <ellipse cx="42" cy="38" rx="4" ry="6" fill="#333" />
                            <ellipse cx="58" cy="38" rx="4" ry="6" fill="#333" />
                            <path d="M50 45 L47 48 L50 50 L53 48 Z" fill="#FF8C42" />
                            <path d="M35 42 L20 40 M35 45 L20 45 M35 48 L20 50" stroke="#333" strokeWidth="1.5" />
                            <path d="M65 42 L80 40 M65 45 L80 45 M65 48 L80 50" stroke="#333" strokeWidth="1.5" />
                            <path d="M75 70 Q85 65 88 75 Q85 80 80 78" stroke="#FFB366" strokeWidth="6" fill="none" strokeLinecap="round" />
                        </motion.svg>

                        {/* Rabbit */}
                        <motion.svg
                            className="absolute"
                            style={{ left: '35%', bottom: '10%' }}
                            width="90"
                            height="110"
                            viewBox="0 0 90 110"
                            fill="none"
                            animate={{ 
                                y: [0, -12, 0],
                                x: [0, 3, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                            <ellipse cx="45" cy="75" rx="25" ry="22" fill="#E5E5E5" />
                            <ellipse cx="45" cy="50" rx="20" ry="18" fill="#E5E5E5" />
                            <ellipse cx="35" cy="25" rx="8" ry="25" fill="#E5E5E5" />
                            <ellipse cx="55" cy="25" rx="8" ry="25" fill="#E5E5E5" />
                            <ellipse cx="35" cy="25" rx="5" ry="20" fill="#FFB3BA" />
                            <ellipse cx="55" cy="25" rx="5" ry="20" fill="#FFB3BA" />
                            <circle cx="38" cy="48" r="4" fill="#333" />
                            <circle cx="52" cy="48" r="4" fill="#333" />
                            <ellipse cx="45" cy="55" rx="3" ry="2" fill="#FFB3BA" />
                            <rect x="42" y="57" width="3" height="4" fill="white" rx="1" />
                            <rect x="45" y="57" width="3" height="4" fill="white" rx="1" />
                        </motion.svg>

                        {/* Bird */}
                        <motion.svg
                            className="absolute"
                            style={{ right: '8%', bottom: '25%' }}
                            width="70"
                            height="70"
                            viewBox="0 0 70 70"
                            fill="none"
                            animate={{ 
                                y: [-5, 5, -5],
                                rotate: [-8, 8, -8]
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 1.5 }}
                        >
                            <ellipse cx="40" cy="40" rx="18" ry="15" fill="#87CEEB" />
                            <circle cx="35" cy="28" r="12" fill="#87CEEB" />
                            <ellipse cx="50" cy="38" rx="15" ry="8" fill="#6BB6D6" transform="rotate(-30 50 38)" />
                            <circle cx="32" cy="26" r="3" fill="#333" />
                            <path d="M25 28 L18 28 L25 30 Z" fill="#FFB366" />
                            <path d="M55 42 L62 38 L62 46 Z" fill="#6BB6D6" />
                            <path d="M35 52 L35 58 M33 58 L37 58" stroke="#FFB366" strokeWidth="2" />
                            <path d="M42 52 L42 58 M40 58 L44 58" stroke="#FFB366" strokeWidth="2" />
                        </motion.svg>

                        {/* Floating hearts */}
                        <motion.div
                            className="absolute"
                            style={{ top: '5%', right: '5%' }}
                            animate={{ 
                                y: [0, -15, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M15 25 C15 25 5 18 5 11 C5 6 8 4 11 4 C13 4 15 6 15 6 C15 6 17 4 19 4 C22 4 25 6 25 11 C25 18 15 25 15 25 Z" fill="#FF6B6B" opacity="0.6" />
                            </svg>
                        </motion.div>

                        <motion.div
                            className="absolute"
                            style={{ bottom: '8%', left: '5%' }}
                            animate={{ 
                                y: [0, -12, 0],
                                opacity: [0.4, 0.9, 0.4]
                            }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                        >
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path d="M12.5 21 C12.5 21 4 15 4 9 C4 5 6.5 3 9 3 C11 3 12.5 5 12.5 5 C12.5 5 14 3 16 3 C18.5 5 21 5 21 9 C21 15 12.5 21 12.5 21 Z" fill="#FF6B6B" opacity="0.5" />
                            </svg>
                        </motion.div>

                        {/* Paw prints */}
                        <motion.svg
                            className="absolute"
                            style={{ top: '50%', left: '50%' }}
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            animate={{ 
                                opacity: [0.2, 0.5, 0.2],
                                scale: [0.9, 1.1, 0.9]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <ellipse cx="20" cy="25" rx="8" ry="10" fill="#F53003" opacity="0.3" />
                            <circle cx="13" cy="15" r="4" fill="#F53003" opacity="0.3" />
                            <circle cx="20" cy="12" r="4" fill="#F53003" opacity="0.3" />
                            <circle cx="27" cy="15" r="4" fill="#F53003" opacity="0.3" />
                        </motion.svg>
                    </div>
                </motion.div>
            </main>

            {/* ABOUT SECTION */}
            <section id="about" className="relative z-10 mx-auto max-w-6xl px-8 py-20">
                <motion.div
                    className="rounded-3xl bg-white/90 p-12 shadow-xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-[#F53003] mb-6">About FurEver Health</h2>
                    <p className="text-lg leading-relaxed text-[#4a4948] mb-4">
                        FurEver Health is a digital system designed to help veterinary clinics and grooming centers manage their services in an organized and efficient way. As pets have become important members of the family, it's essential to have a system that ensures their medical and grooming needs are well-monitored, recorded, and scheduled.
                    </p>
                    <p className="text-lg leading-relaxed text-[#4a4948]">
                        We solve the problems of manual or paper-based processes that often lead to misplaced records, delays in appointments, slower transactions, and difficulty tracking pet services. Through our digital platform, we provide a simple, accurate, and convenient way to ensure faster service, fewer errors, and better pet care management.
                    </p>
                </motion.div>
            </section>

            {/* SYSTEM INFO SECTIONS */}
            <section id="system-info" className="relative z-10 mx-auto max-w-6xl px-8 py-20 space-y-16">
                <motion.h2
                    className="text-center text-4xl font-bold text-[#F53003] mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    🐾 System Information
                </motion.h2>

                {[
                    {
                        title: '💡 System Description',
                        content:
                            'The FurEver Health Grooming and Veterinary Management System is a comprehensive platform that automates scheduling, pet tracking, and staff management — creating a smoother experience for both pet owners and veterinary staff.',
                    },
                    {
                        title: '⚙️ System Features',
                        list: [
                            '👤 User Management — Secure registration and role control',
                            '🐶 Pet Management — Manage multiple pets per owner with detailed profiles',
                            '📅 Appointment Management — Smart booking system with real-time updates',
                            '👨‍🔧 Staff Management — Track staff schedules and roles efficiently',
                            '🕒 Schedule Management — Real-time staff availability monitoring',
                            '🔐 Authentication — Powered by Laravel Fortify for secure access',
                        ],
                    },
                    {
                        title: '🧱 System Architecture',
                        list: [
                            'Frontend: Inertia.js + React',
                            'Backend: Laravel 12 (PHP 8.2)',
                            'Database: MySQL',
                            'ORM: Eloquent',
                            'Auth: Laravel Fortify',
                            'Server: Apache (XAMPP / LAMP)',
                        ],
                    },
                    {
                        title: '🎯 Goals of the System',
                        list: [
                            'Provide a digital alternative to manual bookings and paper records',
                            'Reduce human error and improve operational efficiency',
                            'Offer admins real-time insights into daily operations',
                            'Enhance data reliability, security, and accessibility',
                            'Ensure consistent and timely pet care services',
                        ],
                    },
                ].map((section, i) => (
                    <motion.div
                        key={i}
                        className="rounded-3xl bg-white/90 p-10 shadow-xl"
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 60 }}
                        transition={{ duration: 0.6, delay: i * 0.15 }}
                    >
                        <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
                        {section.content && (
                            <p className="text-lg leading-relaxed text-[#4a4948]">
                                {section.content}
                            </p>
                        )}
                        {section.list && (
                            <ul className="mt-3 space-y-2 text-lg text-[#4a4948]">
                                {section.list.map((item, j) => (
                                    <li key={j}>• {item}</li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                ))}
            </section>

            {/* KEY BENEFITS */}
            <section className="relative z-10 mx-auto max-w-6xl px-8 py-20">
                <motion.h2
                    className="text-center text-4xl font-bold text-[#F53003] mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    ✨ Why Choose FurEver Health?
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: '🏥',
                            title: 'For Veterinary Clinics',
                            desc: 'Streamline operations with automated scheduling, organized records, and better staff coordination.'
                        },
                        {
                            icon: '👨‍⚕️',
                            title: 'For Veterinarians & Staff',
                            desc: 'Access complete pet histories instantly, reduce paperwork, and focus more on quality care.'
                        },
                        {
                            icon: '👥',
                            title: 'For Pet Owners',
                            desc: 'Easy appointment booking, real-time updates, and peace of mind knowing your pet\'s care is documented.'
                        },
                        {
                            icon: '🐾',
                            title: 'For Your Pets',
                            desc: 'Consistent grooming schedules, complete medical records, and better health outcomes.'
                        },
                        {
                            icon: '📊',
                            title: 'Data-Driven Insights',
                            desc: 'Generate reports to monitor clinic performance and make informed decisions.'
                        },
                        {
                            icon: '🔒',
                            title: 'Secure & Reliable',
                            desc: 'Protected data storage with user authentication and access control.'
                        }
                    ].map((benefit, i) => (
                        <motion.div
                            key={i}
                            className="rounded-2xl bg-white/90 p-8 shadow-lg"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-5xl mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-semibold mb-3 text-[#1b1b18]">{benefit.title}</h3>
                            <p className="text-[#706f6c] leading-relaxed">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 mx-auto max-w-4xl px-8 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold mb-6">Ready to Give Your Pet the Best Care?</h2>
                    <p className="text-xl text-[#706f6c] mb-10 leading-relaxed">
                        Join FurEver Health today and experience a better way to manage your pet's grooming and veterinary needs.
                    </p>
                    <a
                        href={route('register')}
                        className="inline-block rounded-full bg-[#F53003] px-16 py-5 text-xl font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#d92a00]"
                    >
                        Get Started Now
                    </a>
                </motion.div>
            </section>

            <footer className="py-10 text-center text-sm text-[#7d7c7a]">
                © {new Date().getFullYear()} FurEver Health Grooming and Veterinary Management System. All rights reserved.
            </footer>
        </div>
    );
}