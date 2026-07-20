/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e53935',
          'red-hover': '#c62828',
          'red-light': '#ffebee',
        },
        dark: {
          bg: '#09090b',       // Deep sleek gray-black (Linear/Vercel style)
          card: '#18181b',     // Card surface
          popover: '#202024',
          border: '#27272a',   // Subtle border color
          text: '#f4f4f5',     // White-gray text
          muted: '#a1a1aa',    // Muted text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
