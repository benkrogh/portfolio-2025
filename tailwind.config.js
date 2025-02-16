/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/pages/blog/posts/*.md",
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
        'geist-sans': ['Geist', 'sans-serif'],
        'geist-mono': ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        "3xl": "24px",
      },
      height: {
        72: "288px", // 72 = 18rem = 288px
      },
      fontSize: {
        sm: "0.938rem",
        base: "1.125rem",
        xl: "1.5rem",
        "2xl": [
          "2rem",
          {
            lineHeight: "3rem",
          },
        ],
        "3xl": [
          "3rem",
          {
            lineHeight: "3.625rem",
          },
        ],
        "4xl": "4rem",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.900"),
            // Headings
            h1: {
              color: theme("colors.gray.900"),
              fontWeight: "400",
              fontSize: "2.5rem",
              fontFamily: theme("fontFamily.mono"),
              letterSpacing: "-0.02em",
            },
            h2: {
              color: theme("colors.gray.900"),
              fontWeight: "400",
              fontSize: "2rem",
              marginTop: "2em",
              marginBottom: "1em",
            },
            h3: {
              color: theme("colors.gray.900"),
              fontWeight: "400",
              fontSize: "1.375rem",
              letterSpacing: "-0.02em",
              marginTop: "1.5em",
              marginBottom: "1.0em",
            },
            // Paragraphs
            p: {
              fontSize: "1.125rem",
              fontWeight: "300",
              lineHeight: "1.625",
              marginTop: "1.25em",
              marginBottom: "1.25em",
            },
            // Lists
            ul: {
              marginTop: "1em",
              marginBottom: "1em",
            },
            li: {
              fontSize: "1.125rem",
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            // Code blocks
            pre: {
              fontSize: "0.938rem",
              padding: "1rem",
            },
            code: {
              fontSize: "0.938rem",
            },
          },
        },
      }),
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
