'use client';
import { useTheme } from '@/lib/theme-context';
import Navigation from './Navigation';
import ThemeToggle from '../ui/ThemeToggle';
import DateTimeDisplay from '../ui/DateTimeDisplay';

export default function AppHeader() {
  const { colors } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 px-4 py-3 flex items-center"
      style={{
        backgroundColor: colors.navBg,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {/* Left: Hamburger */}
      <div className="flex-none">
        <Navigation />
      </div>

      {/* Center: DateTime */}
      <div className="flex-1 flex justify-center">
        <DateTimeDisplay />
      </div>

      {/* Right: Theme Toggle */}
      <div className="flex-none">
        <ThemeToggle />
      </div>
    </header>
  );
}
