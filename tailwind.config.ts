import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    width: {
      desktop: '72rem'
    },
    extend: {
      colors: {
        primary: '#D72638',
        secondary: '#3A506B',
        background: '#F8F9FA',
        accent: '#F4A261',
        text: '#1E1E1E',
      },
      fontFamily: {
        serif: []
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
