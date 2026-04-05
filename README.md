# Our Explorer — Studio Ghibli Travel Journal

Aplikasi eksplorasi perjalanan dengan tema Studio Ghibli yang cozy, earthy, dan bright pastel.
Mendukung dua tema: **Sakura** (perempuan) dan **Forest** (laki-laki).

---

## Fitur

- **Passcode Lock** — Tampilan seperti passcode iPhone (kode: `2617`)
- **Dua Tema** — Sakura (pink pastel) & Forest (hijau earthy), toggle di kanan atas
- **Jam & Tanggal** — Ditampilkan di tengah header, real-time
- **Navigasi Hamburger** — Sidebar kiri dengan karakter Ghibli
- **Locations** — Daftar semua tempat dari Google Sheets, bisa filter kategori & search
- **Visited** — Riwayat kunjungan dengan photobooth (many photos per visit)
- **Animasi Ghibli** — Totoro, Soot Sprites, Calcifer, Kodama, Jiji, No-Face, Ponyo, Haku, Catbus
- **Responsive** — Dioptimalkan untuk iPhone 13, Samsung A16, dan desktop

---

## Setup Google Sheets

### 1. Buat Google Sheet

Buat spreadsheet baru di Google Sheets dengan **3 tab** bernama persis:

#### Tab `locations`
| id | location_name | location_maps | image_url | category | city | created_at | updated_at |
|----|--------------|---------------|-----------|----------|------|------------|------------|
| 1  | Warung Kopi Totoro | https://maps.google.com/... | https://... | Cafe | Bandung | 2024-01-01 | 2024-01-01 |

#### Tab `visits`
| id | location_id | visited_date | notes | rating | photo_url | status | created_at |
|----|-------------|--------------|-------|--------|-----------|--------|------------|
| 1  | 1           | 2024-03-15   | Kopinya enak banget! | 5 | https://... | completed | 2024-03-15 |

- `status`: `completed`, `planned`, atau `wishlist`
- `rating`: angka 1-5

#### Tab `visit_photos`
| id | visit_id | image_url | caption | order | created_at |
|----|----------|-----------|---------|-------|------------|
| 1  | 1        | https://... | Momen sore hari | 1 | 2024-03-15 |

### 2. Share Sheet

- Klik **Share** → **Anyone with the link** → **Viewer**

### 3. Aktifkan Google Sheets API

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih yang ada
3. Cari **Google Sheets API** → Enable
4. Buat **API Key**: APIs & Services → Credentials → Create Credentials → API Key
5. (Opsional) Restrict API key ke Google Sheets API saja

### 4. Konfigurasi Environment

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyABCDEF1234567890
```

---

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build untuk production
npm run build
npm start
```

Buka [http://localhost:3000](http://localhost:3000)

**Passcode: `2617`**

---

## Struktur Project

```
src/
├── app/
│   ├── layout.tsx         # Root layout dengan providers
│   ├── page.tsx           # Home page
│   ├── locations/page.tsx # Locations page
│   └── visited/page.tsx   # Visited page
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx     # Header utama
│   │   ├── AppWrapper.tsx    # Auth gate wrapper
│   │   └── Navigation.tsx    # Hamburger sidebar
│   ├── screens/
│   │   ├── HomeScreen.tsx    # Halaman utama
│   │   ├── LocationsScreen.tsx
│   │   └── VisitedScreen.tsx # Dengan photobooth
│   └── ui/
│       ├── GhibliCharacters.tsx  # Semua karakter SVG
│       ├── PasscodeScreen.tsx    # iPhone-style passcode
│       ├── ThemeToggle.tsx       # Toggle tema
│       └── DateTimeDisplay.tsx   # Jam & tanggal
├── lib/
│   ├── sheets.ts          # Google Sheets API
│   ├── theme-context.tsx  # Theme provider
│   └── auth-context.tsx   # Auth provider
└── types/
    └── index.ts           # TypeScript types
```

---

## Karakter Ghibli yang Digunakan

Semua karakter dibuat sebagai **custom SVG** (bukan image eksternal):

| Karakter | Film | Digunakan di |
|----------|------|--------------|
| Totoro (besar) | My Neighbor Totoro | Home, Sidebar |
| Chibi Totoro | My Neighbor Totoro | Home, Sidebar |
| Soot Sprite | Spirited Away / Totoro | Dekorasi, Loading |
| Calcifer | Howl's Moving Castle | Home (tema laki) |
| Kodama | Princess Mononoke | Locations |
| Jiji | Kiki's Delivery Service | Visited, Sidebar |
| No-Face | Spirited Away | Home (tema perempuan) |
| Haku (naga) | Spirited Away | Background home |
| Ponyo | Ponyo | Home (tema perempuan) |
| Catbus | My Neighbor Totoro | Home bottom |

---

## Customisasi

### Ubah Passcode
Di `src/lib/auth-context.tsx`, ubah:
```ts
const PASSCODE = '2617'; // ganti sesuai keinginan
```

### Ubah Warna Tema
Di `src/lib/theme-context.tsx`, edit objek `femaleColors` atau `maleColors`.

---

## Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel Dashboard:
# NEXT_PUBLIC_GOOGLE_SHEET_ID
# NEXT_PUBLIC_GOOGLE_API_KEY
```

---

Dibuat dengan cinta dan semangat Ghibli.
