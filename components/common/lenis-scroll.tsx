// components/lenis-scroll.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

interface LenisScrollProps {
    children: React.ReactNode;
}

const LenisScroll: React.FC<LenisScrollProps> = ({ children }) => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            smoothTouch: true,
            touchMultiplier: 2,
            wheelMultiplier: 1,
            normalizeWheel: true,
            infinite: false,
            autoResize: true,
        });

        lenisRef.current = lenis;

        // RAF loop
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const rafId = requestAnimationFrame(raf);

        // Cleanup
        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    // Update Lenis on route changes (for Next.js App Router)
    useEffect(() => {
        const handleRouteChange = () => {
            if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true });
            }
        };

        // Listen for route changes (you might need to adjust this based on your router)
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    return <>{children}</>;
};

export default LenisScroll;