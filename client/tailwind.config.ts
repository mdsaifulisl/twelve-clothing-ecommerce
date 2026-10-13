import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cardHeader: "#34B38A",
        cardBody: "#62C4A2",
        cardAccent: "#134E39",
        primary: "#111827",
        surface: "#F9FAFB",
        borderLight: "#E5E7EB",
      },
      fontFamily: {
        sans: ['Inter', 'Hind Siliguri', 'sans-serif'],
        heading: ['Poppins', 'Hind Siliguri', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;


