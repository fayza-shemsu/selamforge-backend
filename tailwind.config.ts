import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e8edff",
          500: "#4661d9",
          600: "#3349b9",
          700: "#293d94"
        },
        ink: "#17202a",
        clay: "#a35f3f",
        leaf: "#22745f"
      },
      boxShadow: {
        soft: "0 12px 40px rgb(23 32 42 / 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
