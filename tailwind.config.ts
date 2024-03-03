import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "primary-color": {
        DEFAULT: "rgb(var(--primary) / <alpha-value>)",
        90: {
          DEFAULT: "rgb(var(--primary) / .9)",
        },
        80: {
          DEFAULT: "rgb(var(--primary) / .8)",
        },
        70: {
          DEFAULT: "rgb(var(--primary) / .7)",
        },
        60: {
          DEFAULT: "rgb(var(--primary) / .6)",
        },
        50: {
          DEFAULT: "rgb(var(--primary) / .5)",
        },
        40: {
          DEFAULT: "rgb(var(--primary) / .4)",
        },
        30: {
          DEFAULT: "rgb(var(--primary) / .3)",
        },
        20: {
          DEFAULT: "rgb(var(--primary) / .2)",
        },
        10: {
          DEFAULT: "rgb(var(--primary) / .1)",
        },
        0: {
          DEFAULT: "rgb(var(--primary) / 0)",
        },
      },
      "accent-color": {
        DEFAULT: "rgb(var(--accent) / <alpha-value>)",
        90: {
          DEFAULT: "rgb(var(--accent) / .9)",
        },
        80: {
          DEFAULT: "rgb(var(--accent) / .8)",
        },
        70: {
          DEFAULT: "rgb(var(--accent) / .7)",
        },
        60: {
          DEFAULT: "rgb(var(--accent) / .6)",
        },
        50: {
          DEFAULT: "rgb(var(--accent) / .5)",
        },
        40: {
          DEFAULT: "rgb(var(--accent) / .4)",
        },
        30: {
          DEFAULT: "rgb(var(--accent) / .3)",
        },
        20: {
          DEFAULT: "rgb(var(--accent) / .2)",
        },
        10: {
          DEFAULT: "rgb(var(--accent) / .1)",
        },
        0: {
          DEFAULT: "rgb(var(--accent) / 0)",
        },
      },
      "transition-color": {
        DEFAULT: "rgb(var(--transition) / <alpha-value>)",
        20: {
          DEFAULT: "rgb(var(--transition) / .2)",
        },
        8: {
          DEFAULT: "rgb(var(--transition) / .08)",
        },
      },
      "brand-color-1st": "rgb(var(--brand-1st) / <alpha-value>)",
      "brand-color-2nd": "rgb(var(--brand-2nd) / <alpha-value>)",
      "brand-color-3rd": "rgb(var(--brand-3rd) / <alpha-value>)",
    },
    extend: {
      maxWidth: {
        "8xl": "96rem",
      },
      height: {
        line: "1px",
      },
      borderWidth: {
        "1.5": "1.5px",
      },
      visible: {
        invisible: "hidden",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        'aeskl': "url('/app-image/bg.jpg')",
        'test': "url('/app-image/test.jpg')",
      }
    },
  },
  plugins: [],
} satisfies Config;
