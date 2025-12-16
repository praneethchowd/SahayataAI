/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF6B35',
        'primary-lightorange': '#FF8C61',
        'primary-darkorange': '#E85A2A',
        'secondary-lightgray': '#F5F5F5',
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // Custom utilities for mobile
    function({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.safe-area-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        }
      })
    }
  ],
}
