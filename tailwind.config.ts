import type { Config } from 'tailwindcss'

/**
 * Ported verbatim from the Stitch export:
 * stitch_gtm_strategy_sales_portfolio/revenue_engineering_system/DESIGN.md
 * Do not hand-edit colour values here — change them in DESIGN.md terms and mirror.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.json'],
  theme: {
    extend: {
      colors: {
        primary: '#0041c8',
        'on-primary': '#ffffff',
        'primary-container': '#0055ff',
        'on-primary-container': '#e3e6ff',
        'inverse-primary': '#b6c4ff',
        'primary-fixed': '#dce1ff',
        'primary-fixed-dim': '#b6c4ff',
        'on-primary-fixed': '#001551',
        'on-primary-fixed-variant': '#0039b3',

        secondary: '#5f5e5e',
        'on-secondary': '#ffffff',
        'secondary-container': '#e5e2e1',
        'on-secondary-container': '#656464',
        'secondary-fixed': '#e5e2e1',
        'secondary-fixed-dim': '#c8c6c5',
        'on-secondary-fixed': '#1c1b1b',
        'on-secondary-fixed-variant': '#474646',

        tertiary: '#505050',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#686868',
        'on-tertiary-container': '#e9e8e7',
        'tertiary-fixed': '#e4e2e2',
        'tertiary-fixed-dim': '#c7c6c6',
        'on-tertiary-fixed': '#1b1c1c',
        'on-tertiary-fixed-variant': '#464747',

        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        surface: '#faf8ff',
        'surface-dim': '#d9d9e6',
        'surface-bright': '#faf8ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f2ff',
        'surface-container': '#ededfb',
        'surface-container-high': '#e7e7f5',
        'surface-container-highest': '#e1e1ef',
        'surface-variant': '#e1e1ef',
        'surface-tint': '#004dea',
        'inverse-surface': '#2e303a',
        'inverse-on-surface': '#f0f0fd',

        'on-surface': '#191b25',
        'on-surface-variant': '#434656',
        background: '#faf8ff',
        'on-background': '#191b25',

        outline: '#737688',
        'outline-variant': '#c3c5d9',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      spacing: {
        unit: '4px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '48px',
        'section-gap': '80px',
        'container-max': '1280px',
      },
      maxWidth: {
        'container-max': '1280px',
      },
      fontFamily: {
        'display-xl': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'headline-lg': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'headline-lg-mobile': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'metric-huge': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'body-lg': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'body-md': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'label-caps': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1.0', letterSpacing: '-0.04em', fontWeight: '600' }],
        'headline-lg': ['40px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '600' }],
        'headline-lg-mobile': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'metric-huge': ['48px', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'label-caps': ['11px', { lineHeight: '1.0', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}

export default config
