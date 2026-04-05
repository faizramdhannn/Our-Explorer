'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = format(now, 'HH:mm:ss');
  const dateStr = format(now, 'EEEE, d MMMM yyyy', { locale: id });

  return (
    <div className="flex flex-col items-center leading-tight">
      <span
        className="text-xl font-bold tracking-widest tabular-nums"
        style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
      >
        {timeStr}
      </span>
      <span
        className="text-xs capitalize"
        style={{ color: colors.earth }}
      >
        {dateStr}
      </span>
    </div>
  );
}
