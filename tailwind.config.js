/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
        display: ['"ZCOOL XiaoWei"', '"Noto Serif SC"', "serif"],
        latin: ['"Cinzel"', "serif"],
      },
      colors: {
        anemo: "#74c2a8",
        geo: "#f4b860",
        electro: "#b78aff",
        dendro: "#a5c83b",
        hydro: "#4cc2f1",
        pyro: "#ef7938",
        cryo: "#7fd8e8",
        gold: "#f5d76e",
        amethyst: "#c08bf0",
        ink: {
          900: "#0a0814",
          800: "#0e0b1a",
          700: "#1a1430",
          600: "#241c44",
          500: "#332859",
        },
      },
      boxShadow: {
        glow: "0 0 24px -4px var(--glow-color, rgba(245,215,110,0.6))",
        "glow-strong":
          "0 0 32px 0 var(--glow-color, rgba(245,215,110,0.7)), inset 0 0 18px -6px var(--glow-color, rgba(245,215,110,0.5))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.4,0,0.2,1) both",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
