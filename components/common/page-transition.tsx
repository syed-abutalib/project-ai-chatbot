// components/page-transition.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Loader from './loader';

interface PageTransitionProps {
    children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Show loader on initial load only for home page
        if (pathname === '/') {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [pathname]);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    // Page transition variants
    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98],
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.5,
                ease: [0.21, 0.47, 0.32, 0.98],
            },
        },
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && pathname === '/' ? (
                    <Loader key="loader" onLoadingComplete={handleLoadingComplete} />
                ) : (
                    <motion.div
                        key={pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PageTransition;