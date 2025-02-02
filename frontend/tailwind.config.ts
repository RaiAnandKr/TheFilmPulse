import { nextui } from "@nextui-org/react";
import { type Config } from "tailwindcss";
import { colors } from "./src/styles/colors";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: colors.primary,
              foreground: "#000000",
            },
            focus: colors.primary,
          },
        },
      },
    }),
  ],
} satisfies Config;
