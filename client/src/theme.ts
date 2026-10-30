export const theme = {
  colors: {
    bg: '#0B0B0D',
    bgSoft: '#101013',
    surface: '#151518',
    surfaceRaised: '#1B1B1F',
    surfaceHover: '#232327',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.14)',
    text: '#F5F5F7',
    textMuted: '#A1A1AA',
    textFaint: '#71717A',
    accent: '#1DB954',
    accentHover: '#1ED760',
    accentPressed: '#17A64A',
    accentSoft: 'rgba(29, 185, 84, 0.14)',
    accentText: '#06130A',
    danger: '#F87171',
    dangerSoft: 'rgba(248, 113, 113, 0.12)',
    success: '#4ADE80',
    warning: '#FBBF24',
    overlay: 'rgba(7, 7, 9, 0.72)',
    white: '#FFFFFF',
    black: '#000000',
  },
  gradients: {
    pageGlow:
      'radial-gradient(circle at 18% -10%, rgba(29, 185, 84, 0.16), transparent 36%), radial-gradient(circle at 88% 0%, rgba(56, 189, 248, 0.08), transparent 28%)',
    login:
      'radial-gradient(circle at 20% 20%, rgba(29, 185, 84, 0.28), transparent 34%), radial-gradient(circle at 78% 68%, rgba(59, 130, 246, 0.18), transparent 34%), linear-gradient(145deg, #09090b 0%, #111114 54%, #0b0b0d 100%)',
    albumOverlay:
      'linear-gradient(90deg, rgba(7, 7, 9, 0.96) 0%, rgba(7, 7, 9, 0.76) 46%, rgba(7, 7, 9, 0.34) 100%)',
    accent: 'linear-gradient(135deg, #1ED760 0%, #0E8F3E 100%)',
  },
  font: {
    family: "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sizes: {
      xs: '12px',
      sm: '13px',
      md: '15px',
      lg: '18px',
      xl: '22px',
      xxl: '28px',
      display: 'clamp(36px, 5vw, 64px)',
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 800,
    },
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    pill: '999px',
  },
  shadows: {
    card: '0 18px 60px rgba(0, 0, 0, 0.32)',
    floating: '0 24px 80px rgba(0, 0, 0, 0.48)',
    focus: '0 0 0 3px rgba(29, 185, 84, 0.28)',
  },
  breakpoints: {
    sm: '640px',
    md: '900px',
    lg: '1200px',
  },
  transitions: {
    fast: '140ms ease',
    base: '220ms ease',
  },
  layout: {
    sidebar: '248px',
    maxWidth: '1180px',
    mobileNav: '68px',
    mobileHeader: '56px',
  },
} as const

export type AppTheme = typeof theme
