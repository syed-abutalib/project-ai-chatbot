// hooks/use-lenis.ts
"use client";

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export const useLenis = (callback?: (lenis: Lenis) => void) => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // @ts-ignore - Lenis is attached to window for global access
        const lenis = window.lenis;
        lenisRef.current = lenis;

        if (callback && lenis) {
            const unsubscribe = lenis.on('scroll', callback);
            return () => unsubscribe();
        }
    }, [callback]);

    return lenisRef.current;
};