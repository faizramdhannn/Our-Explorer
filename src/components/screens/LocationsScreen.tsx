'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { Location } from '@/types';
import { getLocations } from '@/lib/sheets';
import { KodamaSVG, SootSpriteSVG, JijiSVG } from '../ui/GhibliCharacters';
import Image from 'next/image';

const CATEGORIES = ['Semua', 'Cafe', 'Restaurant', 'Nature', 'Mall', 'Museum', 'Beach', 'Other'];
const ADD_CATEGORIES = ['Cafe', 'Restaurant', 'Nature', 'Mall', 'Museum', 'Beach', 'Other'];
const RATINGS = [1, 2, 3, 4, 5];

interface AddLocationForm {
  location_name: string;
  city: string;
  category: string;
  location_maps: string;
  image_url: string;
}

interface CheckInForm {
  visited_date: string;
  notes: string;
  rating: number;
  photo_url: string;
  status: string;
}

const emptyForm: AddLocationForm = {
  location_name: '',
  city: '',
  category: 'Cafe',
  location_maps: '',
  image_url: '',
};

const emptyCheckIn: CheckInForm = {
  visited_date: new Date().toISOString().split('T')[0],
  notes: '',
  rating: 5,
  photo_url: '',
  status: 'completed',
};

export default function LocationsScreen() {
  const { colors } = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Location | null>(null);

  // Add location
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddLocationForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Check in
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInForm, setCheckInForm] = useState<CheckInForm>(emptyCheckIn);
  const [checkInSubmitting, setCheckInSubmitting] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [checkInError, setCheckInError] = useState('');

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

  const handleFormChange = (field: keyof AddLocationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckInChange = (field: keyof CheckInForm, value: string | number) => {
    setCheckInForm((prev) => ({ ...prev, [field]: value }));
  };

  // Submit Add Location
  const handleSubmit = async () => {
    if (!form.location_name.trim() || !form.city.trim()) {
      setSubmitError('Nama lokasi dan kota wajib diisi!');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/sheets/append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan ke spreadsheet');

      const newLocation: Location = {
        id: data.id,
        location_name: form.location_name,
        city: form.city,
        category: form.category,
        location_maps: form.location_maps,
        image_url: form.image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocations((prev) => [newLocation, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowAdd(false);
        setSubmitSuccess(false);
        setForm(emptyForm);
      }, 1200);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Check In
  const handleCheckIn = async () => {
    if (!selected) return;
    setCheckInSubmitting(true);
    setCheckInError('');
    try {
      const res = await fetch('/api/sheets/append-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_id: selected.id,
          ...checkInForm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal check in');

      setCheckInSuccess(true);
      setTimeout(() => {
        setShowCheckIn(false);
        setCheckInSuccess(false);
        setCheckInForm(emptyCheckIn);
        setSelected(null);
      }, 1400);
    } catch (err: unknown) {
      setCheckInError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setCheckInSubmitting(false);
    }
  };

  const handleCloseAdd = () => {
    if (!submitting) {
      setShowAdd(false);
      setForm(emptyForm);
      setSubmitError('');
      setSubmitSuccess(false);
    }
  };

  const handleCloseCheckIn = () => {
    if (!checkInSubmitting) {
      setShowCheckIn(false);
      setCheckInForm(emptyCheckIn);
      setCheckInError('');
      setCheckInSuccess(false);
    }
  };

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
          <div className="flex-1">
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
          <motion.button
            onClick={() => setShowAdd(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm"
            style={{
              backgroundColor: colors.deep,
              color: 'white',
              boxShadow: `0 4px 16px ${colors.border}`,
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah
          </motion.button>
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

      {/* ── Location Detail Modal ── */}
      <AnimatePresence>
        {selected && !showCheckIn && (
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
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: colors.muted, color: colors.deep }}
                  >
                    ✕
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

                {/* Check In Button */}
                <motion.button
                  onClick={() => {
                    setCheckInForm(emptyCheckIn);
                    setCheckInError('');
                    setCheckInSuccess(false);
                    setShowCheckIn(true);
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold"
                  style={{ backgroundColor: colors.deep, color: 'white' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <JijiSVG size={22} />
                  Sudah Dikunjungi? Check In!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Check In Modal ── */}
      <AnimatePresence>
        {showCheckIn && selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={handleCloseCheckIn}
            />
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-t-3xl overflow-hidden"
              style={{ backgroundColor: colors.card, maxHeight: '92vh', overflowY: 'auto' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
              </div>

              <div className="px-5 pb-10 pt-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <JijiSVG size={32} />
                    </motion.div>
                    <div>
                      <h2
                        className="text-lg font-bold"
                        style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
                      >
                        Check In
                      </h2>
                      <p className="text-xs" style={{ color: colors.earth }}>
                        {selected.location_name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseCheckIn}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: colors.muted, color: colors.deep }}
                  >
                    ✕
                  </button>
                </div>

                {/* Success */}
                <AnimatePresence>
                  {checkInSuccess && (
                    <motion.div
                      className="flex flex-col items-center py-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <JijiSVG size={80} />
                      </motion.div>
                      <p
                        className="mt-4 text-lg font-bold"
                        style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
                      >
                        Berhasil Check In! 🎉
                      </p>
                      <p className="text-xs mt-1" style={{ color: colors.earth }}>
                        Tersimpan ke Visited
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                {!checkInSuccess && (
                  <div className="space-y-4 mt-4">

                    {/* Tanggal */}
                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        Tanggal Kunjungan
                      </label>
                      <input
                        type="date"
                        value={checkInForm.visited_date}
                        onChange={(e) => handleCheckInChange('visited_date', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                        style={{
                          backgroundColor: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label
                        className="block text-xs font-bold mb-2"
                        style={{ color: colors.deep }}
                      >
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {RATINGS.map((r) => (
                          <button
                            key={r}
                            onClick={() => handleCheckInChange('rating', r)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all"
                            style={{
                              backgroundColor: r <= checkInForm.rating ? colors.accent + '60' : colors.bg,
                              border: `1.5px solid ${r <= checkInForm.rating ? colors.accent : colors.border}`,
                            }}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        Status
                      </label>
                      <div className="flex gap-2">
                        {['completed', 'planned', 'revisit'].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleCheckInChange('status', s)}
                            className="px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
                            style={{
                              backgroundColor: checkInForm.status === s ? colors.deep : colors.bg,
                              color: checkInForm.status === s ? 'white' : colors.text,
                              border: `1.5px solid ${checkInForm.status === s ? colors.deep : colors.border}`,
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Catatan */}
                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        Catatan
                      </label>
                      <textarea
                        value={checkInForm.notes}
                        onChange={(e) => handleCheckInChange('notes', e.target.value)}
                        placeholder="Ceritakan pengalamanmu..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                        style={{
                          backgroundColor: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    {/* URL Foto */}
                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        URL Foto (opsional)
                      </label>
                      <input
                        value={checkInForm.photo_url}
                        onChange={(e) => handleCheckInChange('photo_url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                        style={{
                          backgroundColor: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                      <AnimatePresence>
                        {checkInForm.photo_url && (
                          <motion.div
                            className="mt-2 relative rounded-2xl overflow-hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 100 }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Image
                              src={checkInForm.photo_url}
                              alt="preview"
                              fill
                              className="object-cover"
                              unoptimized
                              onError={() => handleCheckInChange('photo_url', '')}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Error */}
                    {checkInError && (
                      <motion.p
                        className="text-xs text-center py-2 px-4 rounded-xl"
                        style={{ backgroundColor: '#FFE0E0', color: '#CC4444' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {checkInError}
                      </motion.p>
                    )}

                    {/* Submit */}
                    <motion.button
                      onClick={handleCheckIn}
                      disabled={checkInSubmitting}
                      className="w-full py-4 rounded-2xl font-bold text-sm"
                      style={{
                        backgroundColor: checkInSubmitting ? colors.muted : colors.deep,
                        color: 'white',
                        opacity: checkInSubmitting ? 0.7 : 1,
                      }}
                      whileHover={!checkInSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!checkInSubmitting ? { scale: 0.98 } : {}}
                    >
                      {checkInSubmitting ? 'Menyimpan...' : '✅ Simpan ke Visited'}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Location Modal ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
              onClick={handleCloseAdd}
            />
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-t-3xl overflow-hidden"
              style={{ backgroundColor: colors.card, maxHeight: '92vh', overflowY: 'auto' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
              </div>

              <div className="px-5 pb-10 pt-2">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <KodamaSVG size={32} />
                    </motion.div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
                    >
                      Tambah Lokasi
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseAdd}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: colors.muted, color: colors.deep }}
                  >
                    ✕
                  </button>
                </div>

                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div
                      className="flex flex-col items-center py-8"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <KodamaSVG size={70} />
                      </motion.div>
                      <p
                        className="mt-4 text-lg font-bold"
                        style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
                      >
                        Lokasi ditambahkan!
                      </p>
                      <p className="text-xs mt-1" style={{ color: colors.earth }}>
                        Data tersimpan ke spreadsheet ✨
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!submitSuccess && (
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        Nama Lokasi *
                      </label>
                      <input
                        value={form.location_name}
                        onChange={(e) => handleFormChange('location_name', e.target.value)}
                        placeholder="contoh: Warung Kopi Daun"
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                        style={{
                          backgroundColor: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        Kota *
                      </label>
                      <input
                        value={form.city}
                        onChange={(e) => handleFormChange('city', e.target.value)}
                        placeholder="contoh: Bandung"
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                        style={{
                          backgroundColor: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        Kategori
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ADD_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleFormChange('category', cat)}
                            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                            style={{
                              backgroundColor: form.category === cat ? colors.deep : colors.bg,
                              color: form.category === cat ? 'white' : colors.text,
                              border: `1.5px solid ${form.category === cat ? colors.deep : colors.border}`,
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        Link Google Maps
                      </label>
                      <input
                        value={form.location_maps}
                        onChange={(e) => handleFormChange('location_maps', e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                        style={{
                          backgroundColor: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1.5"
                        style={{ color: colors.deep }}
                      >
                        URL Foto
                      </label>
                      <input
                        value={form.image_url}
                        onChange={(e) => handleFormChange('image_url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                        style={{
                          backgroundColor: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                      <AnimatePresence>
                        {form.image_url && (
                          <motion.div
                            className="mt-2 relative rounded-2xl overflow-hidden"
                            style={{ height: '120px' }}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 120 }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Image
                              src={form.image_url}
                              alt="preview"
                              fill
                              className="object-cover"
                              unoptimized
                              onError={() => handleFormChange('image_url', '')}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {submitError && (
                      <motion.p
                        className="text-xs text-center py-2 px-4 rounded-xl"
                        style={{ backgroundColor: '#FFE0E0', color: '#CC4444' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {submitError}
                      </motion.p>
                    )}

                    <motion.button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full py-4 rounded-2xl font-bold text-sm mt-2"
                      style={{
                        backgroundColor: submitting ? colors.muted : colors.deep,
                        color: 'white',
                        opacity: submitting ? 0.7 : 1,
                      }}
                      whileHover={!submitting ? { scale: 1.02 } : {}}
                      whileTap={!submitting ? { scale: 0.98 } : {}}
                    >
                      {submitting ? 'Menyimpan ke Spreadsheet...' : '✨ Simpan Lokasi'}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}