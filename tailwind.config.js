/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        plex: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        mono: ['"Fragment Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
