'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function VisitedScreen() {
  const { colors } = useTheme();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [photos, setPhotos] = useState<VisitPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    Promise.all([getVisits(), getLocations(), getVisitPhotos()])
      .then(([v, l, p]) => {
        setVisits(v);
        setLocations(l);
        setPhotos(p);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const getLocation = (id: string) => locations.find((l) => l.id === id);
  const getVisitPhotos2 = (visitId: string) =>
    photos.filter((p) => p.visit_id === visitId).sort((a, b) => Number(a.order) - Number(b.order));

  const visitPhotos = selectedVisit ? getVisitPhotos2(selectedVisit.id) : [];
  const selectedLocation = selectedVisit ? getLocation(selectedVisit.location_id) : null;

  // Sort visits by date desc
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(b.visited_date).getTime() - new Date(a.visited_date).getTime()
  );

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
            <JijiSVG size={45} />
          </motion.div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
            >
              Visited
            </h1>
            <p className="text-xs" style={{ color: colors.earth }}>
              {visits.length} rekam jejak
            </p>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <SootSpriteSVG size={50} />
            </motion.div>
            <p className="mt-4 text-sm" style={{ color: colors.earth }}>
              Mengumpulkan...
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
            <p className="text-xs mt-2 opacity-70">
              Pastikan Sheet ID dan API Key sudah diset di .env.local
            </p>
          </div>
        )}

        {/* Visit List */}
        {!loading && !error && (
          <>
            {sortedVisits.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <ChibiTotoroSVG size={70} />
                <p className="mt-4 text-sm" style={{ color: colors.earth }}>
                  Belum ada kunjungan tercatat
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedVisits.map((visit, i) => {
                  const loc = getLocation(visit.location_id);
                  const vPhotos = getVisitPhotos2(visit.id);
                  const statusColor =
                    visit.status === 'completed'
                      ? colors.accent
                      : visit.status === 'planned'
                      ? colors.secondary
                      : colors.primary;

                  return (
                    <motion.button
                      key={visit.id}
                      onClick={() => {
                        setSelectedVisit(visit);
                        setPhotoIndex(0);
                      }}
                      className="w-full rounded-3xl overflow-hidden text-left"
                      style={{
                        backgroundColor: colors.card,
                        border: `1.5px solid ${colors.border}`,
                        boxShadow: `0 4px 16px ${colors.border}`,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex gap-3 p-4">
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-none bg-gray-100">
                          {visit.photo_url ? (
                            <Image
                              src={visit.photo_url}
                              alt={loc?.location_name || ''}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : loc?.image_url ? (
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
                              <JijiSVG size={35} />
                            </div>
                          )}
                          {/* Photo count badge */}
                          {vPhotos.length > 0 && (
                            <div
                              className="absolute bottom-1 right-1 text-xs px-1.5 py-0.5 rounded-full font-bold"
                              style={{ backgroundColor: colors.deep + 'CC', color: 'white' }}
                            >
                              +{vPhotos.length}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className="font-bold text-sm leading-tight line-clamp-2"
                              style={{ color: colors.text }}
                            >
                              {loc?.location_name || `Location #${visit.location_id}`}
                            </p>
                            <span
                              className="flex-none text-xs px-2 py-0.5 rounded-full font-bold capitalize"
                              style={{ backgroundColor: statusColor + '40', color: colors.deep }}
                            >
                              {visit.status}
                            </span>
                          </div>

                          <p className="text-xs mt-1" style={{ color: colors.earth }}>
                            {loc?.city} · {loc?.category}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <StarRating rating={Number(visit.rating) || 0} />
                            <span className="text-xs" style={{ color: colors.earth }}>
                              {visit.visited_date
                                ? new Date(visit.visited_date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </span>
                          </div>

                          {visit.notes && (
                            <p
                              className="text-xs mt-1.5 line-clamp-2 italic"
                              style={{ color: colors.earth }}
                            >
                              "{visit.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Visit Detail / Photobooth Modal */}
      <AnimatePresence>
        {selectedVisit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSelectedVisit(null)}
            />
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-t-3xl overflow-hidden"
              style={{
                backgroundColor: colors.card,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
              </div>

              <div className="px-5 pb-8">
                {/* Location info */}
                <div className="flex items-start justify-between mt-2 mb-4">
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: colors.deep, fontFamily: "'Fredoka One', cursive" }}
                    >
                      {selectedLocation?.location_name || 'Kunjungan'}
                    </h2>
                    <p className="text-sm" style={{ color: colors.earth }}>
                      {selectedLocation?.city} ·{' '}
                      {selectedVisit.visited_date
                        ? new Date(selectedVisit.visited_date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '-'}
                    </p>
                    <div className="mt-1">
                      <StarRating rating={Number(selectedVisit.rating) || 0} />
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVisit(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: colors.muted, color: colors.deep }}
                  >
                    ✕
                  </button>
                </div>

                {/* Photobooth - main photo slider */}
                {visitPhotos.length > 0 ? (
                  <div className="mb-4">
                    <p
                      className="text-sm font-bold mb-3"
                      style={{ color: colors.deep }}
                    >
                      Photobooth ({visitPhotos.length} foto)
                    </p>

                    {/* Main photo */}
                    <div className="relative rounded-3xl overflow-hidden" style={{ height: '260px' }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={photoIndex}
                          className="absolute inset-0"
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={visitPhotos[photoIndex].image_url}
                            alt={visitPhotos[photoIndex].caption || ''}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {visitPhotos[photoIndex].caption && (
                            <div
                              className="absolute bottom-0 left-0 right-0 px-4 py-3"
                              style={{
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                              }}
                            >
                              <p className="text-white text-sm italic">
                                {visitPhotos[photoIndex].caption}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Prev/Next */}
                      {visitPhotos.length > 1 && (
                        <>
                          <button
                            onClick={() => setPhotoIndex((p) => Math.max(0, p - 1))}
                            disabled={photoIndex === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.8)',
                              color: colors.deep,
                              opacity: photoIndex === 0 ? 0.3 : 1,
                            }}
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => setPhotoIndex((p) => Math.min(visitPhotos.length - 1, p + 1))}
                            disabled={photoIndex === visitPhotos.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.8)',
                              color: colors.deep,
                              opacity: photoIndex === visitPhotos.length - 1 ? 0.3 : 1,
                            }}
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail strip */}
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {visitPhotos.map((p, i) => (
                        <motion.button
                          key={p.id}
                          onClick={() => setPhotoIndex(i)}
                          className="flex-none relative w-16 h-16 rounded-xl overflow-hidden"
                          style={{
                            border: `2px solid ${i === photoIndex ? colors.deep : 'transparent'}`,
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Image
                            src={p.image_url}
                            alt={p.caption || ''}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : selectedVisit.photo_url ? (
                  <div className="relative rounded-3xl overflow-hidden mb-4" style={{ height: '220px' }}>
                    <Image
                      src={selectedVisit.photo_url}
                      alt="Visit photo"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}

                {/* Notes */}
                {selectedVisit.notes && (
                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: colors.muted + '60' }}
                  >
                    <p className="text-xs font-bold mb-1" style={{ color: colors.deep }}>
                      Catatan
                    </p>
                    <p className="text-sm italic" style={{ color: colors.text }}>
                      "{selectedVisit.notes}"
                    </p>
                  </div>
                )}

                {/* Maps link */}
                {selectedLocation?.location_maps && (
                  <a
                    href={selectedLocation.location_maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold"
                    style={{ backgroundColor: colors.primary + '50', color: colors.deep }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
