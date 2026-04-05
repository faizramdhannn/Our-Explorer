'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { Visit, Location, VisitPhoto } from '@/types';
import { getVisits, getLocations, getVisitPhotos } from '@/lib/sheets';
import { JijiSVG, SootSpriteSVG, ChibiTotoroSVG } from '../ui/GhibliCharacters';
import Image from 'next/image';

const STARS = [1, 2, 3, 4, 5];

function StarRating({ rating }: { rating: number }) {
  const { colors } = useTheme();
  return (
    <div className="flex gap-0.5">
      {STARS.map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= rating ? colors.accent : 'none'} stroke={colors.accent} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ── Komponen Carousel RTL (kanan ke kiri) ──
function RTLPhotoCarousel({ photos, visitPhoto }: { photos: string[]; visitPhoto?: string }) {
  const { colors } = useTheme();
  const allPhotos = [...photos];
  if (visitPhoto && !allPhotos.includes(visitPhoto)) allPhotos.unshift(visitPhoto);

  // Duplikasi untuk seamless loop
  const doubled = [...allPhotos, ...allPhotos];
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const posRef = useRef(0);
  const animRef = useRef<number>();

  const ITEM_W = 140; // px per item
  const GAP = 12;
  const SPEED = 0.5; // px per frame
  const totalWidth = allPhotos.length * (ITEM_W + GAP);

  useEffect(() => {
    const step = () => {
      if (!isPaused && trackRef.current) {
        posRef.current += SPEED;
        if (posRef.current >= totalWidth) posRef.current = 0;
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current!);
  }, [isPaused, totalWidth]);

  if (allPhotos.length === 0) return null;

  return (
    <div
      className="overflow-hidden relative"
      style={{ borderRadius: 20 }}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
    >
      <div ref={trackRef} className="flex" style={{ gap: GAP, willChange: 'transform' }}>
        {doubled.map((url, i) => (
          <div
            key={i}
            className="flex-none relative rounded-2xl overflow-hidden"
            style={{ width: ITEM_W, height: 100 }}
          >
            <Image
              src={url}
              alt={`foto ${i}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
      {/* Gradient fade kiri-kanan */}
      <div
        className="absolute inset-y-0 left-0 w-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${colors.card}, transparent)` }}
      />
      <div
        className="absolute inset-y-0 right-0 w-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${colors.card}, transparent)` }}
      />
    </div>
  );
}

// ── Photobooth slider di modal ──
function PhotoSlider({
  photos,
  mainPhoto,
}: {
  photos: VisitPhoto[];
  mainPhoto?: string;
}) {
  const { colors } = useTheme();
  const [idx, setIdx] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const allPhotos: { url: string; caption?: string }[] = [];
  if (mainPhoto) allPhotos.push({ url: mainPhoto });
  photos.forEach((p) => allPhotos.push({ url: p.image_url, caption: p.caption }));

  if (allPhotos.length === 0) return null;

  const goNext = () => setIdx((p) => (p + 1) % allPhotos.length);
  const goPrev = () => setIdx((p) => (p - 1 + allPhotos.length) % allPhotos.length);

  const handleDragEnd = (e: React.PointerEvent) => {
    if (dragStart === null) return;
    const diff = dragStart - e.clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
    setDragStart(null);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold" style={{ color: colors.deep }}>
          📸 Foto Kenangan {allPhotos.length > 1 && `(${idx + 1}/${allPhotos.length})`}
        </p>
        {allPhotos.length > 1 && (
          <p className="text-xs" style={{ color: colors.earth }}>← geser →</p>
        )}
      </div>

      {/* Main photo */}
      <div
        className="relative rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: 260 }}
        onPointerDown={(e) => setDragStart(e.clientX)}
        onPointerUp={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Image
              src={allPhotos[idx].url}
              alt={allPhotos[idx].caption || `foto ${idx + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            {allPhotos[idx].caption && (
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.65))' }}
              >
                <p className="text-white text-sm italic">{allPhotos[idx].caption}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Prev/Next buttons */}
        {allPhotos.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: 'rgba(255,255,255,0.85)', color: colors.deep }}
            >‹</button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: 'rgba(255,255,255,0.85)', color: colors.deep }}
            >›</button>
          </>
        )}

        {/* Dots */}
        {allPhotos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {allPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === idx ? 16 : 6,
                  height: 6,
                  backgroundColor: i === idx ? 'white' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {allPhotos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {allPhotos.map((p, i) => (
            <motion.button
              key={i}
              onClick={() => setIdx(i)}
              className="flex-none relative rounded-xl overflow-hidden"
              style={{
                width: 60,
                height: 60,
                border: `2.5px solid ${i === idx ? colors.deep : 'transparent'}`,
              }}
              whileTap={{ scale: 0.92 }}
            >
              <Image src={p.url} alt="" fill className="object-cover" unoptimized />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VisitedScreen() {
  const { colors } = useTheme();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [photos, setPhotos] = useState<VisitPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  useEffect(() => {
    Promise.all([getVisits(), getLocations(), getVisitPhotos()])
      .then(([v, l, p]) => { setVisits(v); setLocations(l); setPhotos(p); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const getLocation = (id: string) => locations.find((l) => l.id === id);
  const getVisitPhotosByVisitId = (visitId: string) =>
    photos.filter((p) => p.visit_id === visitId).sort((a, b) => Number(a.order) - Number(b.order));

  const sortedVisits = [...visits].sort(
    (a, b) => new Date(b.visited_date).getTime() - new Date(a.visited_date).getTime()
  );

  const selectedLocation = selectedVisit ? getLocation(selectedVisit.location_id) : null;
  const selectedPhotos = selectedVisit ? getVisitPhotosByVisitId(selectedVisit.id) : [];

  // Kumpulkan semua URL foto untuk carousel di card
  const getCardPhotos = (visit: Visit) => {
    const vp = getVisitPhotosByVisitId(visit.id).map((p) => p.image_url);
    const all: string[] = [];
    if (visit.photo_url) all.push(visit.photo_url);
    vp.forEach((u) => { if (!all.includes(u)) all.push(u); });
    return all;
  };

  return (
    <div className="min-h-screen" style={{ background: colors.gradient }}>
      <div className="pt-20 pb-10 px-4">
        {/* Header */}
        <motion.div className="flex items-center gap-3 mb-5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity }}><JijiSVG size={45} /></motion.div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}>Visited</h1>
            <p className="text-xs" style={{ color: colors.earth }}>{visits.length} rekam jejak</p>
          </div>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center py-20">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><SootSpriteSVG size={50} /></motion.div>
            <p className="mt-4 text-sm" style={{ color: colors.earth }}>Mengumpulkan kenangan...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl p-4 text-center text-sm" style={{ backgroundColor: '#FFE0E0', color: '#CC4444' }}>
            <p className="font-bold mb-1">Ups! Ada yang salah</p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {sortedVisits.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <ChibiTotoroSVG size={70} />
                <p className="mt-4 text-sm" style={{ color: colors.earth }}>Belum ada kunjungan tercatat</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedVisits.map((visit, i) => {
                  const loc = getLocation(visit.location_id);
                  const cardPhotos = getCardPhotos(visit);
                  const statusColor =
                    visit.status === 'completed' ? colors.accent
                    : visit.status === 'planned' ? colors.secondary
                    : colors.primary;

                  return (
                    <motion.div
                      key={visit.id}
                      className="rounded-3xl overflow-hidden"
                      style={{ backgroundColor: colors.card, border: `1.5px solid ${colors.border}`, boxShadow: `0 4px 16px ${colors.border}` }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      {/* ── FOTO CAROUSEL RTL ── */}
                      {cardPhotos.length > 0 && (
                        <div className="pt-3 px-3">
                          <RTLPhotoCarousel photos={cardPhotos} />
                        </div>
                      )}

                      {/* Jika tidak ada foto, tampilkan placeholder */}
                      {cardPhotos.length === 0 && loc?.image_url && (
                        <div className="relative h-36 overflow-hidden">
                          <Image src={loc.image_url} alt={loc.location_name} fill className="object-cover" unoptimized />
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.3))' }} />
                        </div>
                      )}

                      {/* Info */}
                      <motion.button
                        onClick={() => setSelectedVisit(visit)}
                        className="w-full text-left p-4"
                        whileHover={{ backgroundColor: colors.muted + '30' }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-bold text-sm leading-tight" style={{ color: colors.text }}>
                                {loc?.location_name || `Location #${visit.location_id}`}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: colors.earth }}>
                                {loc?.city} · {loc?.category}
                              </p>
                            </div>
                          </div>
                          <span className="flex-none text-xs px-2 py-0.5 rounded-full font-bold capitalize" style={{ backgroundColor: statusColor + '40', color: colors.deep }}>
                            {visit.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <StarRating rating={Number(visit.rating) || 0} />
                          <span className="text-xs" style={{ color: colors.earth }}>
                            {visit.visited_date
                              ? new Date(visit.visited_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '-'}
                          </span>
                        </div>

                        {visit.notes && (
                          <p className="text-xs mt-2 line-clamp-2 italic" style={{ color: colors.earth }}>
                            "{visit.notes}"
                          </p>
                        )}

                        {/* Tap hint */}
                        <div className="flex items-center gap-1 mt-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.earth} strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          </svg>
                          <span className="text-xs" style={{ color: colors.earth }}>Tap untuk detail</span>
                        </div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Visit Detail Modal ── */}
      <AnimatePresence>
        {selectedVisit && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedVisit(null)} />
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-t-3xl overflow-hidden"
              style={{ backgroundColor: colors.card, maxHeight: '90vh', overflowY: 'auto' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
              </div>

              <div className="px-5 pb-8">
                {/* Location info */}
                <div className="flex items-start justify-between mt-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}>
                      {selectedLocation?.location_name || 'Kunjungan'}
                    </h2>
                    <p className="text-sm" style={{ color: colors.earth }}>
                      {selectedLocation?.city} ·{' '}
                      {selectedVisit.visited_date
                        ? new Date(selectedVisit.visited_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                        : '-'}
                    </p>
                    <div className="mt-1">
                      <StarRating rating={Number(selectedVisit.rating) || 0} />
                    </div>
                  </div>
                  <button onClick={() => setSelectedVisit(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: colors.muted, color: colors.deep }}>✕</button>
                </div>

                {/* Photo Slider (kanan ke kiri swipe) */}
                <PhotoSlider photos={selectedPhotos} mainPhoto={selectedVisit.photo_url || undefined} />

                {/* Notes */}
                {selectedVisit.notes && (
                  <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: colors.muted + '60' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: colors.deep }}>Catatan</p>
                    <p className="text-sm italic" style={{ color: colors.text }}>"{selectedVisit.notes}"</p>
                  </div>
                )}

                {/* Maps link */}
                {selectedLocation?.location_maps && (
                  <a
                    href={selectedLocation.location_maps}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold"
                    style={{ backgroundColor: colors.primary + '50', color: colors.deep }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
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