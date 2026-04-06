import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ImgBB - berbagai subdomain yang dipakai
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
      {
        protocol: 'https',
        hostname: '*.ibb.co',
      },
      // Google Drive (jika masih dipakai sebagai fallback)
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Umum - untuk image_url lokasi dari berbagai sumber
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;