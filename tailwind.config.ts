import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: 'class',
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'bg-light-orange':'rgba(252,245,238,1)',
      'bg-grey': {
        20: 'rgba(105,145,214,.2)',
        8: 'rgba(105,145,214,.08)',
      },
      'bg-white': {
        100: 'rgba(255,255,255,1)',
        50: 'rgba(255,255,255,.5)',
        40: 'rgba(255,255,255,.4)',
        30: 'rgba(255,255,255,.3)',
        20: 'rgba(255,255,255,.2)',
        10: 'rgba(255,255,255,.1)',
      },
      'bg-dark': {
        100: 'rgba(0,0,0,1)',
        50: 'rgba(0,0,0,.5)',
        40: 'rgba(0,0,0,.4)',
        30: 'rgba(0,0,0,.3)',
        20: 'rgba(0,0,0,.2)',
        10: 'rgba(0,0,0,.1)',
      },
      'main-color': {
        100: 'rgba(47,26,73,1)',
        70: 'rgba(47,26,73,.7)',
        50: 'rgba(47,26,73,.5)'
      },
      'brand-color-blue': '#95CFD5',
      'brand-color-orange': '#FD7E50',
    },
    extend: {
      maxWidth: {
        '8xl': "96rem"
      },
      height: {
        'line': '1px'
      },
      borderWidth: {
        '1': '1px',
        '1.5': '1.5px'
      },
      visible: {
        invisible: 'hidden'
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
