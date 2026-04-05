'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/lib/theme-context';
import {
  TotoroSVG, SootSpriteSVG, KodamaSVG,
  ChibiTotoroSVG, JijiSVG, HakuSVG,
} from '../ui/GhibliCharacters';
import Link from 'next/link';
import { getVisits } from '@/lib/sheets';
import { Visit } from '@/types';
import Image from 'next/image';

// Floating leaf
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

// ── RTL Photo Carousel (foto visited berjalan kanan→kiri) ──
function VisitedPhotoCarousel({ visits }: { visits: Visit[] }) {
  const { colors } = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef<number>();
  const [isPaused, setIsPaused] = useState(false);

  // Ambil semua foto dari visits yang punya photo_url
  const photos = visits.filter((v) => v.photo_url).map((v) => ({
    url: v.photo_url,
    label: v.notes || '',
  }));

  const ITEM_W = 120;
  const GAP = 10;
  const SPEED = 0.45;
  const totalWidth = photos.length * (ITEM_W + GAP);

  // Duplikasi untuk seamless loop
  const doubled = [...photos, ...photos, ...photos];

  useEffect(() => {
    const step = () => {
      if (!isPaused && trackRef.current && photos.length > 0) {
        posRef.current += SPEED;
        if (posRef.current >= totalWidth) posRef.current = 0;
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current!);
  }, [isPaused, totalWidth, photos.length]);

  // ── STATE KOSONG ── kotak-kotak placeholder berjalan RTL
  if (photos.length === 0) {
    const placeholders = Array.from({ length: 8 });
    const doubledPlaceholders = [...placeholders, ...placeholders, ...placeholders];

    return (
      <EmptyCarousel colors={colors} ITEM_W={ITEM_W} GAP={GAP} SPEED={SPEED} doubledPlaceholders={doubledPlaceholders} totalWidth={placeholders.length * (ITEM_W + GAP)} />
    );
  }

  return (
    <div
      className="overflow-hidden relative"
      style={{ borderRadius: 16, height: 110 }}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex absolute top-0 left-0"
        style={{ gap: GAP, willChange: 'transform' }}
      >
        {doubled.map((p, i) => (
          <div
            key={i}
            className="flex-none relative rounded-2xl overflow-hidden"
            style={{ width: ITEM_W, height: 110, flexShrink: 0 }}
          >
            <Image
              src={p.url}
              alt={p.label}
              fill
              className="object-cover"
              unoptimized
            />
            {/* subtle vignette */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 60%)' }}
            />
          </div>
        ))}
      </div>
      {/* Edge fade */}
      <div className="absolute inset-y-0 left-0 w-8 pointer-events-none z-10" style={{ background: `linear-gradient(to right, ${colors.card}, transparent)` }} />
      <div className="absolute inset-y-0 right-0 w-8 pointer-events-none z-10" style={{ background: `linear-gradient(to left, ${colors.card}, transparent)` }} />
    </div>
  );
}

// ── EMPTY STATE: kotak placeholder berjalan RTL dengan teks "kosong" ──
function EmptyCarousel({ colors, ITEM_W, GAP, SPEED, doubledPlaceholders, totalWidth }: {
  colors: { border: string; muted: string; earth: string; card: string };
  ITEM_W: number; GAP: number; SPEED: number;
  doubledPlaceholders: unknown[];
  totalWidth: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef<number>();

  useEffect(() => {
    const step = () => {
      posRef.current += SPEED * 0.7;
      if (posRef.current >= totalWidth) posRef.current = 0;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current!);
  }, [totalWidth, SPEED]);

  const emptyLabels = ['kosong'];

  return (
    <div
      className="overflow-hidden relative"
      style={{ borderRadius: 16, height: 110 }}
    >
      <div
        ref={trackRef}
        className="flex absolute top-0 left-0"
        style={{ gap: GAP, willChange: 'transform' }}
      >
        {doubledPlaceholders.map((_, i) => (
          <div
            key={i}
            className="flex-none rounded-2xl flex items-center justify-center"
            style={{
              width: ITEM_W,
              height: 110,
              backgroundColor: colors.muted + '50',
              border: `1.5px dashed ${colors.border}`,
              flexShrink: 0,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              {/* Dotted grid pattern */}
              <div className="grid grid-cols-3 gap-1 mb-1">
                {Array.from({ length: 9 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: colors.border, opacity: 0.6 + (j % 3) * 0.15 }}
                  />
                ))}
              </div>
              <span
                className="text-xs font-bold tracking-wide"
                style={{
                  color: colors.earth,
                  fontFamily: "'Fredoka One', cursive",
                  opacity: 0.7,
                  fontSize: 11,
                }}
              >
                {emptyLabels[i % emptyLabels.length]}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Edge fade */}
      <div className="absolute inset-y-0 left-0 w-8 pointer-events-none z-10" style={{ background: `linear-gradient(to right, ${colors.card}, transparent)` }} />
      <div className="absolute inset-y-0 right-0 w-8 pointer-events-none z-10" style={{ background: `linear-gradient(to left, ${colors.card}, transparent)` }} />
    </div>
  );
}

export default function HomeScreen() {
  const { colors, theme } = useTheme();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);

  useEffect(() => {
    getVisits()
      .then(setVisits)
      .catch(() => {})
      .finally(() => setLoadingVisits(false));
  }, []);

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

  // Foto visited yang punya foto (urutkan terbaru)
  const visitedWithPhotos = [...visits]
    .sort((a, b) => new Date(b.visited_date).getTime() - new Date(a.visited_date).getTime());

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: colors.gradient }}
    >
      {/* Falling leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Leaf key={i} color={leafColors[i % leafColors.length]} x={5 + i * 6.5} delay={i * 0.8} />
        ))}
      </div>

      {/* Background Haku */}
      <div className="absolute top-24 right-0 opacity-15 pointer-events-none">
        <motion.div
          animate={{ x: [-20, 20, -20], y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HakuSVG size={300} />
        </motion.div>
      </div>

      <div className="relative z-10 px-5 pt-24 pb-10">

        {/* Hero */}
        <motion.div
          className="flex flex-col items-center text-center mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <TotoroSVG size={150} />
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${20 + i * 15}%`,
                  left: i % 2 === 0 ? '-40px' : 'auto',
                  right: i % 2 === 1 ? '-40px' : 'auto',
                }}
                animate={{ y: [0, -8, 0], rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              >
                <SootSpriteSVG size={18 + i * 4} />
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            className="mt-6 text-4xl font-bold leading-tight"
            style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive", textShadow: `2px 2px 0px ${colors.border}` }}
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
                style={{ backgroundColor: bg, border: `2px solid ${colors.border}`, boxShadow: `0 4px 20px ${colors.border}` }}
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
                <p className="mt-3 font-bold text-sm" style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ color: colors.earth }}>{subtitle}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* ── FOTO PERJALANAN ── */}
        <motion.div
          className="mt-10 rounded-3xl p-4"
          style={{ backgroundColor: colors.card, border: `2px solid ${colors.border}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
              >
                {theme === 'female' ? '🌸 Foto Perjalanan' : '🌿 Foto Perjalanan'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: colors.earth }}>
                {loadingVisits
                  ? 'Memuat...'
                  : visitedWithPhotos.filter(v => v.photo_url).length > 0
                    ? `${visitedWithPhotos.filter(v => v.photo_url).length} foto kenangan`
                    : 'Belum ada foto — yuk check in!'}
              </p>
            </div>

            {/* Tombol ke visited */}
            <Link href="/visited">
              <motion.div
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: colors.primary + '60', color: colors.deep }}
                whileTap={{ scale: 0.95 }}
              >
                Lihat semua →
              </motion.div>
            </Link>
          </div>

          {/* Carousel */}
          {loadingVisits ? (
            // Skeleton loading
            <div className="flex gap-2.5 overflow-hidden" style={{ height: 110, borderRadius: 16 }}>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-none rounded-2xl"
                  style={{ width: 120, height: 110, backgroundColor: colors.muted + '60' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <VisitedPhotoCarousel visits={visitedWithPhotos} />
          )}
        </motion.div>

        {/* Chibi totoro di bawah sebagai footer karakter */}
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
            <ChibiTotoroSVG size={80} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}