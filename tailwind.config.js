/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'gentle-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.3)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.5)',
            transform: 'scale(1.02)',
          },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'stone-drop': {
          '0%': {
            transform: 'translateY(-4px) scale(0.9)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(1px) scale(1.05)',
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
        },
        'capture-shrink': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(0)',
            opacity: '0',
          },
        },
        'highlight-ring': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(var(--primary-rgb), 0)',
          },
          '50%': {
            boxShadow: '0 0 0 6px rgba(var(--primary-rgb), 0.3)',
          },
        },
        'pit-receive': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
          },
          '50%': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 20px 4px rgba(59, 130, 246, 0.6)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
          },
        },
        'store-receive': {
          '0%': {
            transform: 'scale(1)',
          },
          '25%': {
            transform: 'scale(1.05)',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
          '75%': {
            transform: 'scale(1.05)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gentle-glow': 'gentle-glow 2s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
        'stone-drop': 'stone-drop 0.3s ease-out',
        'capture-shrink': 'capture-shrink 0.5s ease-in-out forwards',
        'highlight-ring': 'highlight-ring 2s ease-in-out infinite',
        'pit-receive': 'pit-receive 0.6s ease-out',
        'store-receive': 'store-receive 0.5s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
