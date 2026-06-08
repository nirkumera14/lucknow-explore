/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf8e8',
          100: '#faefc5',
          200: '#f5d980',
          300: '#f0c53b',
          400: '#e8b420',
          500: '#c9a84c',
          600: '#b8952e',
          700: '#9a7820',
          800: '#7d5f18',
          900: '#654d12',
        },
        navy: {
          900: '#0a0a1a',
          800: '#0f0f2d',
          700: '#141440',
          600: '#1a1a55',
        },
        amber: {
          warm: '#f59e0b',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hero-pattern': "url('/assets/patterns/hero-bg.svg')",
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #f0c53b 50%, #c9a84c 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a1a 0%, #141440 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        scaleIn: { '0%': { transform: 'scale(0.95)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' }, '50%': { boxShadow: '0 0 0 10px rgba(201,168,76,0)' } }
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'gold': '0 4px 24px rgba(201,168,76,0.3)',
        'gold-lg': '0 8px 40px rgba(201,168,76,0.4)',
        'card': '0 4px 20px rgba(0,0,0,0.3)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.5)',
      }
    }
  },
  plugins: [],
};
