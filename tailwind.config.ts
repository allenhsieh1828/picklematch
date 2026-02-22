import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 品牌色
        'pickle-green': '#BEF264',
        'pickle-dark': '#1F2937',
      },
      fontFamily: {
        sans: ['var(--font-noto)', 'PingFang TC', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '80%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-once': {
          '0%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
          '60%': { transform: 'translateY(-3px)' },
        },
      },
      animation: {
        'scale-in': 'scale-in 0.4s cubic-bezier(.4,0,.2,1) forwards',
        'bounce-once': 'bounce-once 0.5s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
