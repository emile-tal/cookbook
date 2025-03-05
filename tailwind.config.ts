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
    colors: {
      primary: '#D72638',
      secondary: '#3A506B',
      background: '#F8F9FA',
      accent: '#F4A261',
      text: '#1E1E1E'
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        serif: [

        ]
      }
    },
  },
  plugins: [],
} satisfies Config;
