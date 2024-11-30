/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'accent-red': '#EC6A5C',
        'accent-orange': '#E69D72',
        'accent-blue': '#77B7EA',
        'accent-green': '#A8D5B1',
        'dark-brown': '#521710',
      },
      fontFamily: {
        mono: ['SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        '3xl': '32px',
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
};