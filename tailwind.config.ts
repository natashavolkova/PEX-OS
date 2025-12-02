import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PEX-OS ATHENA Theme Colors
        'pex-dark': '#0f111a',
        'pex-panel': '#1e2330',
        'pex-secondary': '#13161c',
        'pex-tertiary': '#252b3b',
        'pex-primary': '#2979ff',
        'pex-primary-hover': '#2264d1',
        'pex-purple': '#5b4eff',
        'pex-success': '#10b981',
        'pex-warning': '#f59e0b',
        'pex-error': '#ef4444',
        'pex-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'slide-up-fade': 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'modal-bounce': 'modalBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'success-pulse': 'successPulse 0.6s cubic-bezier(0.4, 0, 0.6, 1)',
        'shimmer': 'shimmer 2s infinite',
        'error-shake': 'errorShake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'slide-left': 'slideLeft 0.3s ease-out forwards',
        'slide-right': 'slideRight 0.3s ease-out forwards',
        'pop-in-menu': 'popInMenu 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'context-menu': 'contextMenuIn 0.15s ease-out forwards',
        'toast-in': 'toastSlideIn 0.3s ease-out forwards',
        'toast-out': 'toastSlideOut 0.3s ease-in forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      keyframes: {
        slideUpFade: {
          from: {
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        modalBounceIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9) translateY(30px)',
          },
          '60%': {
            opacity: '1',
            transform: 'scale(1.02) translateY(-5px)',
          },
          '100%': {
            transform: 'scale(1) translateY(0)',
          },
        },
        successPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
          },
          '50%': {
            transform: 'scale(1.03)',
            boxShadow: '0 0 0 15px rgba(16, 185, 129, 0)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        errorShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        popInMenu: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        contextMenuIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        toastSlideIn: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        toastSlideOut: {
          from: { opacity: '1', transform: 'translateX(0)' },
          to: { opacity: '0', transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(41, 121, 255, 0.4)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(41, 121, 255, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'blue': '0 10px 25px -5px rgba(41, 121, 255, 0.3)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'glow-blue': '0 0 20px rgba(41, 121, 255, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-purple': '0 0 20px rgba(91, 78, 255, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
