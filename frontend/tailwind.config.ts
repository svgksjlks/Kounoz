/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Cairo', 'system-ui', 'sans-serif'],
        display: ['Cairo', '"Amiri"', 'serif'],
        serif: ['"Amiri"', 'Cairo', 'serif'],
      },
      colors: {
        // Centralized Theme Color System connected to CSS Variables
        main:     'var(--bg-main)',
        card:     'var(--bg-card)',
        surface:  'var(--bg-surface)',
        mutedbg:  'var(--bg-muted)',
        
        noir:     'var(--text-main)',
        muted:    'var(--text-muted)',
        lighttext:'var(--text-light)',
        
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          light:   'var(--accent-light)',
        },
        
        kounoz: {
          camel:    '#8C6B4F',
          gold:     '#AD8A55',
          softgold: '#D8C6A3',
          deepivory:'#EFE9DB',
          ivory:    '#F6F2E9',
        },
        
        border: {
          subtle:  'var(--border-subtle)',
          focus:   'var(--border-focus)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
