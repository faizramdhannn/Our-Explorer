'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300"
      style={{
        backgroundColor: theme === 'female' ? colors.primary : colors.primary,
        boxShadow: `0 2px 10px ${colors.border}`,
      }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${theme === 'female' ? 'forest' : 'sakura'} theme`}
    >
      <motion.div
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
        animate={{ x: theme === 'female' ? 0 : 22 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ backgroundColor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
      >
        {theme === 'female' ? (
          // Sakura/flower icon
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" fill="#F9A8D4" />
            <ellipse cx="8" cy="3" rx="2" ry="2.5" fill="#FDA4AF" transform="rotate(0, 8, 8)" />
            <ellipse cx="8" cy="3" rx="2" ry="2.5" fill="#FDA4AF" transform="rotate(72, 8, 8)" />
            <ellipse cx="8" cy="3" rx="2" ry="2.5" fill="#FDA4AF" transform="rotate(144, 8, 8)" />
            <ellipse cx="8" cy="3" rx="2" ry="2.5" fill="#FDA4AF" transform="rotate(216, 8, 8)" />
            <ellipse cx="8" cy="3" rx="2" ry="2.5" fill="#FDA4AF" transform="rotate(288, 8, 8)" />
          </svg>
        ) : (
          // Leaf/acorn icon for male
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 14 C8 14 2 10 2 6 C2 3.8 4.8 2 8 2 C11.2 2 14 3.8 14 6 C14 10 8 14 8 14Z" fill="#86EFAC" />
            <path d="M8 14 L8 6" stroke="#3D6B4F" strokeWidth="1" />
            <path d="M8 8 L5 6" stroke="#3D6B4F" strokeWidth="1" />
            <path d="M8 10 L11 7" stroke="#3D6B4F" strokeWidth="1" />
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
}
