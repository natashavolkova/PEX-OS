/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
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
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'blue': '0 10px 25px -5px rgba(41, 121, 255, 0.3)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
