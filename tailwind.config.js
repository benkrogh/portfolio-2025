/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/pages/blog/posts/*.md"
  ],
  theme: {
    extend: {
      colors: {
        "accent-red": "#EC6A5C",
        "accent-orange": "#E69D72",
        "accent-blue": "#77B7EA",
        "accent-green": "#A8D5B1",
        "dark-brown": "#521710",
      },
      fontFamily: {
        mono: ["GeistMono", "Menlo", "monospace"],
      },
      borderRadius: {
        "3xl": "32px",
      },
      height: {
        '72': '288px',  // 72 = 18rem = 288px
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '800',
            },
            h3: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '1.5em',
              marginBottom: '0.75em',
            },
          },
        },
      }),
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
  ],
};
