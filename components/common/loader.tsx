// components/loader.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Brain, Globe, Cpu } from 'lucide-react';

interface LoaderProps {
    onLoadingComplete?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [currentIcon, setCurrentIcon] = useState(0);

    const icons = [Sparkles, Zap, Shield, Brain, Globe, Cpu];

    useEffect(() => {
        // Cycle through icons
        const iconInterval = setInterval(() => {
            setCurrentIcon((prev) => (prev + 1) % icons.length);
        }, 300);

        // Simulate loading progress
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    clearInterval(iconInterval);
                    setIsComplete(true);

                    // Call onLoadingComplete after a small delay
                    setTimeout(() => {
                        if (onLoadingComplete) {
                            onLoadingComplete();
                        }
                    }, 800);

                    return 100;
                }
                return prev + 1;
            });
        }, 30);

        return () => {
            clearInterval(timer);
            clearInterval(iconInterval);
        };
    }, [onLoadingComplete, icons.length]);

    const CurrentIcon = icons[currentIcon];

    // Container variants
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: {
            opacity: 0,
            scale: 1.1,
            transition: {
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    // Text variants
    const textVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3,
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    // Progress bar variants
    const progressVariants = {
        initial: { scaleX: 0 },
        animate: {
            scaleX: progress / 100,
            transition: {
                duration: 0.1,
                ease: "linear"
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {!isComplete && (
                <motion.div
                    key="loader"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                >
                    {/* Animated background grid */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }} />
                    </div>

                    {/* Animated gradient orbs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            x: [0, 30, -30, 0],
                            y: [0, -30, 30, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
                    />

                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                            x: [0, -40, 40, 0],
                            y: [0, 40, -40, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
                    />

                    {/* Main content */}
                    <div className="relative z-10 max-w-md w-full px-4 text-center">
                        {/* Animated icon */}
                        <motion.div
                            key={currentIcon}
                            initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotate: 180 }}
                            transition={{
                                duration: 0.4,
                                ease: [0.21, 0.47, 0.32, 0.98]
                            }}
                            className="flex justify-center mb-8"
                        >
                            <div className="relative">
                                {/* Glow effect */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 0.8, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                                />

                                {/* Icon container */}
                                <div className="relative w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
                                    <CurrentIcon className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Loading text */}
                        <motion.h2
                            variants={textVariants}
                            initial="initial"
                            animate="animate"
                            className="text-2xl sm:text-3xl font-medium text-white mb-4"
                        >
                            Loading
                            <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="inline-block w-1 ml-1"
                            >
                                ...
                            </motion.span>
                        </motion.h2>

                        {/* Loading message */}
                        <motion.p
                            variants={textVariants}
                            className="text-white/40 text-sm mb-8"
                        >
                            Preparing an amazing experience for you
                        </motion.p>

                        {/* Progress bar */}
                        <div className="relative h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                            <motion.div
                                variants={progressVariants}
                                initial="initial"
                                animate="animate"
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/60 via-white to-white/60 rounded-full origin-left"
                            />
                        </div>

                        {/* Progress percentage */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-between items-center text-sm"
                        >
                            <span className="text-white/40">Initializing</span>
                            <span className="text-white font-medium">{progress}%</span>
                        </motion.div>

                        {/* Loading tips carousel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 text-center"
                        >
                            <p className="text-xs text-white/30">
                                {progress < 30 && "Loading core modules..."}
                                {progress >= 30 && progress < 60 && "Preparing AI models..."}
                                {progress >= 60 && progress < 90 && "Optimizing performance..."}
                                {progress >= 90 && "Almost there..."}
                            </p>
                        </motion.div>
                    </div>

                    {/* Bottom branding */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/20 text-xs"
                    >
                        <span>© {new Date().getFullYear()} SaaSFlow</span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;