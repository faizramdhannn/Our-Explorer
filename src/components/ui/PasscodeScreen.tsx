'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { TotoroSVG, SootSpriteSVG } from './GhibliCharacters';

const CORRECT_CODE = '2617';

export default function PasscodeScreen({ onSuccess }: { onSuccess: () => void }) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const { authenticate } = useAuth();
  const { colors, theme } = useTheme();

  useEffect(() => {
    if (input.length === 4) {
      const ok = authenticate(input);
      if (ok) {
        setSuccess(true);
        setTimeout(onSuccess, 1000);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setInput('');
        }, 600);
      }
    }
  }, [input, authenticate, onSuccess]);

  const handleKey = (k: string) => {
    if (input.length < 4) {
      setInput((p) => p + k);
    }
  };

  const handleDelete = () => setInput((p) => p.slice(0, -1));

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  const bgStyle = theme === 'female'
    ? 'from-pink-100 via-rose-50 to-amber-50'
    : 'from-green-100 via-emerald-50 to-teal-50';

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-between bg-gradient-to-br ${bgStyle} overflow-hidden`}>
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating soot sprites */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, i % 2 === 0 ? 8 : -8, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <SootSpriteSVG size={20 + (i % 3) * 8} />
          </motion.div>
        ))}
      </div>

      {/* Top section with Totoro */}
      <div className="flex flex-col items-center pt-16 z-10">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TotoroSVG size={100} />
        </motion.div>
        <motion.h1
          className="mt-4 text-2xl font-bold"
          style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Our Explorer
        </motion.h1>
        <motion.p
          className="text-sm mt-1"
          style={{ color: colors.earth }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Enter your secret code
        </motion.p>
      </div>

      {/* Middle - Dots */}
      <div className="z-10 flex flex-col items-center gap-8">
        <motion.div
          className="flex gap-4"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-5 h-5 rounded-full border-2"
              style={{ borderColor: colors.deep }}
              animate={
                success
                  ? { scale: [1, 1.3, 1], backgroundColor: colors.primary }
                  : input.length > i
                  ? { scale: [1, 1.2, 1], backgroundColor: colors.deep }
                  : { backgroundColor: 'transparent' }
              }
              transition={{ duration: 0.2, delay: success ? i * 0.08 : 0 }}
            />
          ))}
        </motion.div>

        {/* Success message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-lg font-bold" style={{ color: colors.deep }}>
                Welcome home!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom - Keypad */}
      <div className="z-10 mb-16 px-8 w-full max-w-xs">
        <div className="grid grid-cols-3 gap-3">
          {keys.map((k, i) => (
            <motion.button
              key={i}
              onClick={() => {
                if (k === '⌫') handleDelete();
                else if (k !== '') handleKey(k);
              }}
              className={`h-16 rounded-2xl text-xl font-bold flex items-center justify-center ${
                k === '' ? 'pointer-events-none opacity-0' : ''
              }`}
              style={{
                backgroundColor: k === '' ? 'transparent' : 'rgba(255,255,255,0.7)',
                color: colors.deep,
                boxShadow: k === '' ? 'none' : `0 4px 12px ${colors.border}`,
                backdropFilter: 'blur(8px)',
              }}
              whileTap={k !== '' ? { scale: 0.9, backgroundColor: colors.primary } : {}}
              transition={{ duration: 0.1 }}
            >
              {k}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
