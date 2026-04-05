'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { Location } from '@/types';
import { getLocations } from '@/lib/sheets';
import { KodamaSVG, SootSpriteSVG } from '../ui/GhibliCharacters';
import Image from 'next/image';

const CATEGORIES = ['Semua', 'Cafe', 'Restaurant', 'Nature', 'Mall', 'Museum', 'Beach', 'Other'];

export default function LocationsScreen() {
  const { colors } = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Location | null>(null);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = locations.filter((l) => {
    const matchCat = selectedCat === 'Semua' || l.category === selectedCat;
    const matchSearch =
      l.location_name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: colors.gradient }}>
      <div className="pt-20 pb-10 px-4">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <KodamaSVG size={45} />
          </motion.div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
            >
              Locations
            </h1>
            <p className="text-xs" style={{ color: colors.earth }}>
              {locations.length} tempat menakjubkan
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tempat atau kota..."
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{
              backgroundColor: colors.card,
              border: `1.5px solid ${colors.border}`,
              color: colors.text,
            }}
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className="flex-none px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all"
              style={{
                backgroundColor: selectedCat === cat ? colors.deep : colors.card,
                color: selectedCat === cat ? 'white' : colors.text,
                border: `1.5px solid ${selectedCat === cat ? colors.deep : colors.border}`,
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <SootSpriteSVG size={50} />
            </motion.div>
            <p className="mt-4 text-sm" style={{ color: colors.earth }}>
              Memuat tempat-tempat indah...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl p-4 text-center text-sm"
            style={{ backgroundColor: '#FFE0E0', color: '#CC4444' }}
          >
            <p className="font-bold mb-1">Ups! Ada yang salah</p>
            <p className="text-xs">{error}</p>
            <p className="text-xs mt-2" style={{ color: '#888' }}>
              Pastikan NEXT_PUBLIC_GOOGLE_SHEET_ID dan NEXT_PUBLIC_GOOGLE_API_KEY sudah diset di .env.local
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <KodamaSVG size={60} />
                <p className="mt-4 text-sm" style={{ color: colors.earth }}>
                  Belum ada tempat yang ditemukan
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((loc, i) => (
                  <motion.button
                    key={loc.id}
                    onClick={() => setSelected(loc)}
                    className="rounded-3xl overflow-hidden text-left"
                    style={{
                      backgroundColor: colors.card,
                      border: `1.5px solid ${colors.border}`,
                      boxShadow: `0 4px 16px ${colors.border}`,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Image */}
                    <div className="relative h-28 bg-gray-100 overflow-hidden">
                      {loc.image_url ? (
                        <Image
                          src={loc.image_url}
                          alt={loc.location_name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: colors.muted }}
                        >
                          <KodamaSVG size={40} />
                        </div>
                      )}
                      <span
                        className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: colors.primary + 'CC', color: colors.deep }}
                      >
                        {loc.category}
                      </span>
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <p
                        className="font-bold text-sm leading-tight line-clamp-2"
                        style={{ color: colors.text }}
                      >
                        {loc.location_name}
                      </p>
                      <p className="text-xs mt-1" style={{ color: colors.earth }}>
                        {loc.city}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-t-3xl overflow-hidden"
              style={{ backgroundColor: colors.card, maxHeight: '80vh', overflowY: 'auto' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Image */}
              {selected.image_url && (
                <div className="relative h-48">
                  <Image
                    src={selected.image_url}
                    alt={selected.location_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
                    >
                      {selected.location_name}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: colors.earth }}>
                      {selected.city} · {selected.category}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.muted, color: colors.deep }}
                  >
                    x
                  </button>
                </div>

                {selected.location_maps && (
                  <a
                    href={selected.location_maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold"
                    style={{ backgroundColor: colors.primary + '50', color: colors.deep }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Buka di Google Maps
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
