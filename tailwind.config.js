/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        facebook: {
          light: {
            primary: '#1877F2',
            secondary: '#E4E6EB',
            background: '#FFFFFF',
            surface: '#F0F2F5',
            text: '#1C1E21',
            'text-secondary': '#65676B'
          },
          dark: {
            primary: '#4B96F4', // Lightened for better visibility
            secondary: '#4A4C4F', // Adjusted for better contrast
            background: '#18191A',
            surface: '#242526',
            text: '#E9EAEB', // Lightened for better readability
            'text-secondary': '#CBCDCF' // Lightened for better contrast
          }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#4B96F4', // Updated link color
              '&:hover': {
                color: '#6AABFF', // Lighter hover state
              },
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgb(255 255 255 / 0.1)', // Adjusted for dark mode
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'rgb(255 255 255 / 0.1)', // Adjusted for dark mode
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
            },
          },
        },
      },
      boxShadow: {
        'surface-light': '0 2px 5px rgba(0, 0, 0, 0.05)',
        'surface-dark': '0 2px 5px rgba(0, 0, 0, 0.3)', // Increased opacity for better visibility
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}