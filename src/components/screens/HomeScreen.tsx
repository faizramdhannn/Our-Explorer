'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import {
  TotoroSVG, SootSpriteSVG, CalciferSVG, KodamaSVG,
  ChibiTotoroSVG, JijiSVG, HakuSVG, PonyoSVG, NoFaceSVG, CatbusSVG
} from '../ui/GhibliCharacters';
import Link from 'next/link';

// Floating leaf SVG
function Leaf({ color, x, delay }: { color: string; x: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: '-30px' }}
      animate={{ y: ['0px', '110vh'], x: [0, 30, -20, 10], rotate: [0, 180, 360] }}
      transition={{ duration: 8 + delay, repeat: Infinity, delay, ease: 'linear' }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20">
        <path d="M8 18 C4 14 1 8 4 4 C6 1 10 1 12 4 C15 8 12 14 8 18Z" fill={color} opacity="0.7" />
        <line x1="8" y1="18" x2="8" y2="4" stroke={color} strokeWidth="1" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

export default function HomeScreen() {
  const { colors, theme } = useTheme();

  const leafColors = theme === 'female'
    ? ['#F9A8D4', '#FDE68A', '#A7F3D0', '#FECDD3']
    : ['#86EFAC', '#93C5FD', '#FCD34D', '#6EE7B7'];

  const quickLinks = [
    {
      href: '/locations',
      title: 'Locations',
      subtitle: 'Temukan tempat baru',
      Char: KodamaSVG,
      charSize: 50,
      bg: colors.primary + '40',
    },
    {
      href: '/visited',
      title: 'Visited',
      subtitle: 'Rekam Jejak',
      Char: JijiSVG,
      charSize: 50,
      bg: colors.secondary + '40',
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: colors.gradient }}
    >
      {/* Animated falling leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Leaf
            key={i}
            color={leafColors[i % leafColors.length]}
            x={5 + i * 6.5}
            delay={i * 0.8}
          />
        ))}
      </div>

      {/* Background Haku dragon */}
      <div className="absolute top-24 right-0 opacity-15 pointer-events-none">
        <motion.div
          animate={{ x: [-20, 20, -20], y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HakuSVG size={300} />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-5 pt-24 pb-10">

        {/* Hero Section */}
        <motion.div
          className="flex flex-col items-center text-center mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Big Totoro floating */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <TotoroSVG size={150} />
            {/* Soot sprites around totoro */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${20 + i * 15}%`,
                  left: i % 2 === 0 ? '-40px' : 'auto',
                  right: i % 2 === 1 ? '-40px' : 'auto',
                }}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 20, -20, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              >
                <SootSpriteSVG size={18 + i * 4} />
              </motion.div>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="mt-6 text-4xl font-bold leading-tight"
            style={{
              color: colors.deep,
              fontFamily: "'Fredoka One', cursive",
              textShadow: `2px 2px 0px ${colors.border}`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Our Explorer
          </motion.h1>

          <motion.p
            className="mt-2 text-base max-w-xs"
            style={{ color: colors.earth }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {theme === 'female'
              ? 'Hallo Afri, Setiap perjalanan mengajarkan sesuatu yang bermakna'
              : 'Halo Faiz, Setiap langkah adalah petualangan baru'}
          </motion.p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="grid grid-cols-2 gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {quickLinks.map(({ href, title, subtitle, Char, charSize, bg }, i) => (
            <Link href={href} key={href}>
              <motion.div
                className="rounded-3xl p-5 flex flex-col items-center text-center cursor-pointer"
                style={{
                  backgroundColor: bg,
                  border: `2px solid ${colors.border}`,
                  boxShadow: `0 4px 20px ${colors.border}`,
                }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  <Char size={charSize} />
                </motion.div>
                <p
                  className="mt-3 font-bold text-sm"
                  style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
                >
                  {title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: colors.earth }}>
                  {subtitle}
                </p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Featured Characters Row */}
        <motion.div
          className="mt-10 rounded-3xl p-5"
          style={{
            backgroundColor: colors.card,
            border: `2px solid ${colors.border}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p
            className="text-center text-sm font-bold mb-4"
            style={{ color: colors.deep }}
          >
            {theme === 'female' ? 'Teman Perjalanan' : 'Penjaga Hutan'}
          </p>
          <div className="flex justify-around items-end">
            {theme === 'female' ? (
              <>
                {[{ C: PonyoSVG, s: 45, d: 0 }, { C: ChibiTotoroSVG, s: 55, d: 0.3 }, { C: NoFaceSVG, s: 50, d: 0.6 }].map(({ C, s, d }, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: d }}
                  >
                    <C size={s} />
                  </motion.div>
                ))}
              </>
            ) : (
              <>
                {[{ C: KodamaSVG, s: 45, d: 0 }, { C: TotoroSVG, s: 55, d: 0.3 }, { C: CalciferSVG, s: 50, d: 0.6 }].map(({ C, s, d }, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: d }}
                  >
                    <C size={s} />
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </motion.div>

        {/* Catbus at bottom */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CatbusSVG size={160} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
