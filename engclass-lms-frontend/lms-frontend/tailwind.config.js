/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          900: "#4C1D95",
        },
        accent: {
          500: "#3B82F6",
          600: "#2563EB",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#0EA5E9",
        // Permukaan khusus dark mode (§28 PRD tidak mewajibkan dark mode untuk MVP,
        // tapi warna brand yang sama tetap dipakai — hanya tone permukaan yang disesuaikan
        // supaya kontras tetap nyaman, mengikuti catatan "dark mode: gray-900 sebagai
        // background & gray-50 sebagai teks").
        surface: {
          dark: "#0B0F19",
          darkcard: "#131826",
        },
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
        "hero-gradient-dark": "linear-gradient(135deg, #6D28D9 0%, #1D4ED8 100%)",
        "grid-pattern":
          "linear-gradient(to right, rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "count-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
          "50%": { transform: "translateY(-14px) rotate(1deg)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "marquee-reverse": "marquee-reverse 36s linear infinite",
        "count-in": "count-in 0.4s ease-out",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
      maxWidth: {
        "7xl": "1280px",
      },
    },
  },
  plugins: [],
};
