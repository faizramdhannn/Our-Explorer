/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Female theme - soft sakura pastel
        fem: {
          bg: '#FFF5F0',
          primary: '#F9A8D4',
          secondary: '#FDE68A',
          accent: '#A7F3D0',
          earth: '#D4A5A5',
          deep: '#9D6B6B',
          text: '#5C3D3D',
          muted: '#E8C4C4',
          card: '#FFF0F5',
          border: '#F0C0C0',
        },
        // Male theme - forest earthy
        male: {
          bg: '#F0F7F0',
          primary: '#86EFAC',
          secondary: '#93C5FD',
          accent: '#FCD34D',
          earth: '#A5B4A5',
          deep: '#3D6B4F',
          text: '#2D4A3E',
          muted: '#C4D8C4',
          card: '#F0F5F0',
          border: '#B0D0B0',
        },
      },
      fontFamily: {
        ghibli: ['Nunito', 'Comic Sans MS', 'cursive'],
        title: ['Fredoka One', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'ghibli': '1.5rem',
        'ghibli-lg': '2.5rem',
      },
      boxShadow: {
        'ghibli': '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'ghibli-hover': '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideUp': 'slideUp 0.4s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'leaf-fall': 'leafFall 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        leafFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100px) rotate(360deg)', opacity: '0' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '412px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
