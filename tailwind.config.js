// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        floatX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(12px)' },
        },
      },
      animation: {
        floatX: 'floatX 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
