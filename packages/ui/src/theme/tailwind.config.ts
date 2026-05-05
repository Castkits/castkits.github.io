export const castkitTailwindPreset = {
  theme: {
    extend: {
      colors: {
        cast: {
          primary: '#7C3AED',
          secondary: '#5B21B6',
          accent: '#14B8A6',
          dark: '#0F0F1A',
          darker: '#080810',
          border: '#1E1E2E',
          muted: '#6B7280',
          danger: '#F43F5E',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        cast: '0 0 0 1px rgba(124, 58, 237, 0.3), 0 20px 80px rgba(20, 184, 166, 0.15)',
      },
      backgroundImage: {
        'cast-grid':
          'linear-gradient(rgba(124,58,237,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cast-grid': '32px 32px',
      },
    },
  },
};

