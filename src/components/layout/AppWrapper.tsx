'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import PasscodeScreen from '@/components/ui/PasscodeScreen';
import AppHeader from '@/components/layout/AppHeader';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) setShowContent(true);
  }, [isAuthenticated]);

  if (!mounted) return null;

  if (!isAuthenticated && !showContent) {
    return <PasscodeScreen onSuccess={() => setShowContent(true)} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen"
        style={{ backgroundColor: colors.bg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Subtle grain overlay for Ghibli film feel */}
        <div className="grain-overlay" />

        <AppHeader />

        <main className="relative">
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
