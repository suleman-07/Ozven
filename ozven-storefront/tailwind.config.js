/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A24B',
          light: '#D4AF6A',
          hairline: '#B08D3F',
        },
        dark: {
          DEFAULT: '#0D0D0D',
          alt: '#141414',
        },
        base: '#F8F6F2',
        charcoal: '#2B2B2B',
        emerald: '#1F4D3A',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 40px rgba(13, 13, 13, 0.08)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        heroPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.85s ease-out both',
        'fade-in': 'fadeIn 1.1s ease-out 0.15s both',
        shimmer: 'shimmer 1.6s linear infinite',
        marquee: 'marquee 48s linear infinite',
        float: 'float 6.5s ease-in-out infinite',
        'hero-pulse': 'heroPulse 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
