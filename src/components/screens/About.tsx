import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Github, Instagram, Mail, Zap, Target, BarChart3, Users } from 'lucide-react';

interface AboutProps {
    onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
    const features = [
        {
            icon: Zap,
            title: 'Gamified Focus',
            description: 'Transform your study sessions into immersive journeys'
        },
        {
            icon: Target,
            title: 'Smart Tracking',
            description: 'Track focus metrics, distractions, and personal growth'
        },
        {
            icon: BarChart3,
            title: 'Analytics Dashboard',
            description: 'Visualize your progress with detailed insights'
        },
        {
            icon: Users,
            title: 'Achievements',
            description: 'Earn badges and unlock milestones as you focus'
        }
    ];

    const socialLinks = [
        {
            icon: Github,
            label: 'GitHub',
            url: 'https://github.com/pokephantom98765',
            color: 'hover:text-gray-300'
        },
        {
            icon: Instagram,
            label: 'Instagram',
            url: 'https://instagram.com/abhi_guptha_24',
            color: 'hover:text-pink-400'
        },
        {
            icon: Mail,
            label: 'Email',
            url: 'mailto:pokephantom98765@gmail.com',
            color: 'hover:text-blue-400'
        }
    ];

    return (
        <div className="relative z-10 min-h-[100dvh] w-full overflow-y-auto overscroll-contain p-4 sm:p-6 [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto max-w-2xl"
            >
                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBack}
                        className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                    >
                        <ArrowLeft className="h-5 w-5 text-white" />
                    </motion.button>
                    <h1 className="text-3xl font-bold text-white">About StudyTravel</h1>
                    <div className="w-9" />
                </div>

                {/* Main Description */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8"
                >
                    <h2 className="mb-4 text-2xl font-bold text-white">Welcome Aboard!</h2>
                    <p className="mb-4 text-gray-300 leading-relaxed">
                        StudyTravel Simulator is a gamified focus timer that transforms mundane study sessions into thrilling journeys. Whether you're boarding a flight, catching a train, or hitting the roads, every study minute becomes part of an adventure.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Designed to help you maintain focus, track progress, and celebrate wins, StudyTravel makes studying feel less like a chore and more like an expedition worth taking.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h3 className="mb-6 text-xl font-bold text-white">Key Features</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {features.map((feature, idx) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:bg-white/[0.06]"
                                >
                                    <div className="mb-3 inline-flex rounded-lg bg-blue-500/10 p-2">
                                        <IconComponent className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <h4 className="mb-2 font-semibold text-white">{feature.title}</h4>
                                    <p className="text-sm text-gray-400">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Creator Info */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8"
                >
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white">Creator</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-lg font-semibold text-white">Tekulapalli Abhiram</p>
                            <p className="text-sm text-gray-400">Full Stack Developer | Focus Enthusiast</p>
                        </div>
                        <div className="mt-6 flex gap-4 sm:mt-0">
                            {socialLinks.map((link, idx) => {
                                const IconComponent = link.icon;
                                return (
                                    <motion.a
                                        key={idx}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={link.url}
                                        target={link.label !== 'Email' ? '_blank' : undefined}
                                        rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                                        className={`rounded-full bg-white/10 p-3 transition-all ${link.color} hover:bg-white/20`}
                                        title={link.label}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                    <h4 className="mb-4 font-semibold text-white">Built With</h4>
                    <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Vite', 'Motion', 'Gemini API'].map((tech) => (
                            <motion.span
                                key={tech}
                                whileHover={{ scale: 1.05 }}
                                className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 transition-colors hover:bg-blue-500/30"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <p className="mb-6 text-gray-400">
                        Ready to turn your study sessions into adventures?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBack}
                        className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-blue-500/50"
                    >
                        Start Your Journey
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};
