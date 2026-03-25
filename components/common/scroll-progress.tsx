// components/scroll-progress.tsx
"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/40 via-white to-white/40 z-50 origin-left"
            style={{ scaleX }}
        />
    );
};

export default ScrollProgress;