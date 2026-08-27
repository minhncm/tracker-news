import { alpha, createTheme } from '@mui/material/styles'

const FONT = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace"

export const SIDEBAR_WIDTH = 248
export const SIDEBAR_WIDTH_MINI = 64

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      dark: '#4338ca',
      light: '#6366f1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f6f7f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
    divider: '#e5e7eb',
    success: { main: '#16a34a' },
    info: { main: '#2563eb' },
    warning: { main: '#b45309' },
    error: { main: '#dc2626' },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: FONT,
    h1: {
      fontSize: 26,
      lineHeight: 1.3,
      letterSpacing: -0.4,
      fontWeight: 650,
    },
    h2: {
      fontSize: 20,
      fontWeight: 650,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 15,
      fontWeight: 600,
    },
    body2: {
      fontSize: 13.5,
    },
    subtitle2: {
      fontSize: 13.5,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 12,
        },
      },
    },
  },
})

export const mono = { fontFamily: MONO }

/** Soft tinted background derived from a palette color, e.g. for badges. */
export function soft(hex: string) {
  return alpha(hex, 0.12)
}