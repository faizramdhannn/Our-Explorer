'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { TotoroSVG, SootSpriteSVG, KodamaSVG, JijiSVG, ChibiTotoroSVG } from '../ui/GhibliCharacters';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    label: 'Home',
    desc: 'Kembali ke hutan',
    CharSVG: ChibiTotoroSVG,
  },
  {
    href: '/locations',
    label: 'Locations',
    desc: 'Jelajahi tempat baru',
    CharSVG: KodamaSVG,
  },
  {
    href: '/visited',
    label: 'Visited',
    desc: 'Kenangan perjalanan',
    CharSVG: JijiSVG,
  },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { colors, theme } = useTheme();
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden"
            style={{
              width: 'min(75vw, 300px)',
              background: colors.gradient,
              boxShadow: '4px 0 30px rgba(0,0,0,0.15)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Sidebar Header */}
            <div className="pt-16 pb-6 px-6 flex flex-col items-center" style={{ borderBottom: `1px solid ${colors.border}` }}>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <TotoroSVG size={80} />
              </motion.div>
              <p
                className="mt-3 text-lg font-bold"
                style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
              >
                Our Explorer
              </p>
              <p className="text-xs mt-0.5" style={{ color: colors.earth }}>
                {theme === 'female' ? 'Sakura Journey' : 'Forest Adventure'}
              </p>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 pt-6 space-y-2">
              {navItems.map(({ href, label, desc, CharSVG }, i) => {
                const active = pathname === href;
                return (
                  <motion.div
                    key={href}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
                      style={{
                        backgroundColor: active ? colors.primary + '60' : 'transparent',
                        border: `1.5px solid ${active ? colors.primary : 'transparent'}`,
                      }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <CharSVG size={36} />
                      </div>
                      <div>
                        <p
                          className="font-bold text-sm"
                          style={{ color: active ? colors.deep : colors.text }}
                        >
                          {label}
                        </p>
                        <p className="text-xs" style={{ color: colors.earth }}>
                          {desc}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom floating soot sprites */}
            <div className="px-6 pb-10">
              <div className="flex gap-3 justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <SootSpriteSVG size={20 + i * 2} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hamburger Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-xl z-50"
        style={{
          backgroundColor: colors.card,
          boxShadow: `0 2px 10px ${colors.border}`,
          border: `1.5px solid ${colors.border}`,
        }}
        whileTap={{ scale: 0.9 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block rounded-full"
            style={{ backgroundColor: colors.deep, height: '2px', width: i === 1 ? '14px' : '18px' }}
            animate={
              open
                ? i === 0
                  ? { rotate: 45, y: 6, width: '18px' }
                  : i === 1
                  ? { opacity: 0 }
                  : { rotate: -45, y: -6, width: '18px' }
                : { rotate: 0, y: 0, opacity: 1, width: i === 1 ? '14px' : '18px' }
            }
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.button>
    </>
  );
}
