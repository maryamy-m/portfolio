import type { Config } from 'tailwindcss'

/**
 * Ported from the Stitch screen "Portfolio | Refined Spacing & Compact Footer"
 * (project 1000797297664788185, screen 295198633b0740a7bf53bed06175e1a3).
 *
 * Typeface roles: Sora for display/headline, Manrope for body, JetBrains Mono
 * for labels. All three are loaded in app/layout.tsx via next/font/google and
 * exposed as the CSS variables referenced below.
 *
 * Stays on Tailwind v3 — the fontSize tuple format below is v3-only.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.json'],
  theme: {
    extend: {
      colors: {
        /* primary */
        primary: '#00003c',
        'on-primary': '#ffffff',
        'primary-container': '#000080',
        'on-primary-container': '#777eea',
        'inverse-primary': '#bfc2ff',
        'primary-fixed': '#e0e0ff',
        'primary-fixed-dim': '#bfc2ff',
        'on-primary-fixed': '#00006e',
        'on-primary-fixed-variant': '#3239a3',

        /* secondary */
        secondary: '#585b85',
        'on-secondary': '#ffffff',
        'secondary-container': '#cccefe',
        'on-secondary-container': '#545680',
        'secondary-fixed': '#e0e0ff',
        'secondary-fixed-dim': '#c1c3f3',
        'on-secondary-fixed': '#15173d',
        'on-secondary-fixed-variant': '#41436c',

        /* tertiary */
        tertiary: '#220000',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#4d0000',
        'on-tertiary-container': '#d96756',
        'tertiary-fixed': '#ffdad4',
        'tertiary-fixed-dim': '#ffb4a8',
        'on-tertiary-fixed': '#410000',
        'on-tertiary-fixed-variant': '#82271c',

        /* error */
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        /* surface */
        background: '#f9fafb',
        'on-background': '#1b1b22',
        surface: '#f9fafb',
        'on-surface': '#111827',
        'surface-variant': '#e4e1eb',
        'on-surface-variant': '#4b5563',
        'surface-dim': '#dbd9e2',
        'surface-bright': '#fbf8ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f2fc',
        'surface-container': '#f3f4f6',
        'surface-container-high': '#eae7f0',
        'surface-container-highest': '#e4e1eb',
        'inverse-surface': '#303037',
        'inverse-on-surface': '#f2eff9',
        'surface-tint': '#4b53bc',

        /* outline */
        outline: '#6b7280',
        'outline-variant': '#d1d5db',
      },
      fontFamily: {
        'display-lg': ['var(--font-sora)', 'Sora', 'system-ui', 'sans-serif'],
        'headline-md': ['var(--font-sora)', 'Sora', 'system-ui', 'sans-serif'],
        'body-md': ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        'body-lg': ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        'label-mono': ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        'display-lg-mobile': ['var(--font-sora)', 'Sora', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['32px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '1.8', letterSpacing: '0', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.8', letterSpacing: '0', fontWeight: '400' }],
        'label-mono': ['14px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '500' }],
        'display-lg-mobile': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      spacing: {
        'container-max': '1280px',
        'gutter': '24px',
        'margin-mobile': '20px',
        'stack-gap': '32px',
        'margin-desktop': '64px',
        'section-gap': '120px',
      },
      maxWidth: {
        'container-max': '1280px',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
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
