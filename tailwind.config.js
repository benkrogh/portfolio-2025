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
        "text-primary": "#17120A",
      },
      fontFamily: {
        mono: ["Geist Mono", "Menlo", "monospace"],
        'geist-sans': ['Geist', 'system-ui', 'sans-serif'],
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
            fontFamily: theme("fontFamily.mono"),
            color: "#17120A",
            // Headings
            h1: {
              color: "#17120A",
              fontWeight: "400",
              fontSize: "2.5rem",
              fontFamily: theme("fontFamily.mono"),
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            },
            h2: {
              color: "#17120A",
              fontWeight: "500",
              fontSize: "2rem",
              marginTop: "2em",
              marginBottom: "1em",
              fontFamily: theme("fontFamily.mono"),
              letterSpacing: "-0.02em",
              lineHeight: 1.2,   
              marginTop: "1.5em",           
            },
            h3: {
              color: "#17120A",
              fontWeight: "500",
              fontSize: "1.375rem",
              fontFamily: theme("fontFamily.mono"),
              letterSpacing: "-0.02em",
              marginTop: "1.5em",
              marginBottom: "1.0em",
              lineHeight: 1.4,
              '&.intro-paragraph': {
                marginBottom: "2.5rem",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              },
            },
            // Paragraphs
            p: {
              fontSize: "1.125rem",
              fontWeight: "400",
              fontFamily: theme("fontFamily.mono"),
              lineHeight: "1.625",
              marginTop: "1.25em",
              marginBottom: "1.25em",
              '& + p': {
                marginTop: "0.5rem", // This is equivalent to space-y-2
              },
              '&.intro-paragraph': {
                fontSize: '1.375rem',
                lineHeight: '1.4',
                fontWeight: '400',
                letterSpacing: '-0.02em',
                marginBottom: '1.5rem',
              },
            },
            // Space between all block-level elements
            '> * + *': {
              marginTop: "0.5rem", // This is equivalent to space-y-2
            },
            // Lists
            ul: {
              marginTop: "1em",
              marginBottom: "1em",
              fontFamily: theme("fontFamily.mono"),
            },
            ol: {
              fontFamily: theme("fontFamily.mono"),
            },
            li: {
              fontSize: "1.125rem",
              marginTop: "0.5em",
              marginBottom: "0.5em",
              fontFamily: theme("fontFamily.mono"),
            },
            // Code blocks
            pre: {
              fontSize: "0.938rem",
              padding: "1rem",
              fontFamily: theme("fontFamily.mono"),
            },
            code: {
              fontSize: "0.938rem",
              fontFamily: theme("fontFamily.mono"),
            },
            // Links
            a: {
              fontFamily: theme("fontFamily.mono"),
            },
            // Strong, em
            strong: {
              fontFamily: theme("fontFamily.mono"),
            },
            em: {
              fontFamily: theme("fontFamily.mono"),
            },
            // Block quotes
            blockquote: {
              fontFamily: theme("fontFamily.mono"),
              borderLeftWidth: '0',
              borderLeftColor: 'transparent',
              paddingLeft: '0',
              fontStyle: 'normal',
              quotes: 'none',
              '&::before': {
                content: 'none',
              },
              '&::after': {
                content: 'none',
              },
              p: {
                fontSize: '1.5rem',
                lineHeight: '1.5',
                color: '#333',
                fontWeight: '400',
                letterSpacing: '-0.01em',
                '&::before': {
                  content: 'none',
                },
                '&::after': {
                  content: 'none',
                },
              },
            },
          },
        },
      }),
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
