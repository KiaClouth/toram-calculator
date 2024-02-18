import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: 'class',
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'primary-color': {
        DEFAULT: 'rgb(var(--white) / <alpha-value>)',
        light: 'rgb(var(--white) / <alpha-value>)',
        dark: 'rgb(var(--dark) / <alpha-value>)',
        90: {
          DEFAULT: 'rgb(var(--white) / .9)',
          light: 'rgb(var(--white) / .9)',
          dark: 'rgb(var(--dark) / .9)',
        },
        80: {
          DEFAULT: 'rgb(var(--white) / .8)',
          light: 'rgb(var(--white) / .8)',
          dark: 'rgb(var(--dark) / .8)',
        },
        70: {
          DEFAULT: 'rgb(var(--white) / .7)',
          light: 'rgb(var(--white) / .7)',
          dark: 'rgb(var(--dark) / .7)',
        },
        60: {
          DEFAULT: 'rgb(var(--white) / .6)',
          light: 'rgb(var(--white) / .6)',
          dark: 'rgb(var(--dark) / .6)',
        },
        50: {
          DEFAULT: 'rgb(var(--white) / .5)',
          light: 'rgb(var(--white) / .5)',
          dark: 'rgb(var(--dark) / .5)',
        },
        40: {
          DEFAULT: 'rgb(var(--white) / .4)',
          light: 'rgb(var(--white) / .4)',
          dark: 'rgb(var(--dark) / .4)',
        },
        30: {
          DEFAULT: 'rgb(var(--white) / .3)',
          light: 'rgb(var(--white) / .3)',
          dark: 'rgb(var(--dark) / .3)',
        },
        20: {
          DEFAULT: 'rgb(var(--white) / .2)',
          light: 'rgb(var(--white) / .2)',
          dark: 'rgb(var(--dark) / .2)',
        },
        10:{
          DEFAULT: 'rgb(var(--white) / .1)',
          light: 'rgb(var(--white) / .1)',
          dark: 'rgb(var(--dark) / .1)',
        },
      },
      'accent-color': {
        DEFAULT: 'rgb(var(--brown) / <alpha-value>)',
        light: 'rgb(var(--brown) / <alpha-value>)',
        dark: 'rgb(var(--white) / <alpha-value>)',
        90: {
          DEFAULT: 'rgb(var(--brown) / .9)',
          light: 'rgb(var(--brown) / .9)',
          dark: 'rgb(var(--white) / .9)',
        },
        80: {
          DEFAULT: 'rgb(var(--brown) / .8)',
          light: 'rgb(var(--brown) / .8)',
          dark: 'rgb(var(--white) / .8)',
        },
        70: {
          DEFAULT: 'rgb(var(--brown) / .7)',
          light: 'rgb(var(--brown) / .7)',
          dark: 'rgb(var(--white) / .7)',
        },
        60: {
          DEFAULT: 'rgb(var(--brown) / .6)',
          light: 'rgb(var(--brown) / .6)',
          dark: 'rgb(var(--white) / .6)',
        },
        50: {
          DEFAULT: 'rgb(var(--brown) / .5)',
          light: 'rgb(var(--brown) / .5)',
          dark: 'rgb(var(--white) / .5)',
        },
        40: {
          DEFAULT: 'rgb(var(--brown) / .4)',
          light: 'rgb(var(--brown) / .4)',
          dark: 'rgb(var(--white) / .4)',
        },
        30: {
          DEFAULT: 'rgb(var(--brown) / .3)',
          light: 'rgb(var(--brown) / .3)',
          dark: 'rgb(var(--white) / .3)',
        },
        20: {
          DEFAULT: 'rgb(var(--brown) / .2)',
          light: 'rgb(var(--brown) / .2)',
          dark: 'rgb(var(--white) / .2)',
        },
        10:{
          DEFAULT: 'rgb(var(--brown) / .1)',
          light: 'rgb(var(--brown) / .1)',
          dark: 'rgb(var(--white) / .1)',
        },
      },
      'transtion-color': {
        DEFAULT: 'rgb(var(--navyBlue) / <alpha-value>)',
        light: 'rgb(var(--navyBlue) / <alpha-value>)',
        dark: 'rgb(var(--white) / <alpha-value>)',
        20: {
          DEFAULT: 'rgb(var(--navyBlue) / .2)',
          light: 'rgb(var(--navyBlue) / .2)',
          dark: 'rgb(var(--white) / .2)',
        },
        8: {
          DEFAULT: 'rgb(var(--navyBlue) / .08)',
          light: 'rgb(var(--navyBlue) / .08)',
          dark: 'rgb(var(--white) / .08)',
        },
      },
      'brand-color-1st': 'rgb(var(--greenBlue) / <alpha-value>)',
      'brand-color-2nd': 'rgb(var(--orange) / <alpha-value>)',
      'brand-color-3rd': 'rgb(var(--yellow) / <alpha-value>)',
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
