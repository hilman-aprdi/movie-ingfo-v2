import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050816",
          900: "#0b1020",
          800: "#131a31",
        },
        aurora: {
          300: "#9bd5ff",
          400: "#7ab8ff",
          500: "#5a8dff",
          600: "#4367f6",
        },
        ember: {
          300: "#ffcf9b",
          400: "#ffb46f",
          500: "#ff8d4f",
        },
      },
      boxShadow: {
        glow: "0 24px 80px rgba(67, 103, 246, 0.24)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(90, 141, 255, 0.22), transparent 46%), radial-gradient(circle at 80% 20%, rgba(255, 141, 79, 0.18), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
