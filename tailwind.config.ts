import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ✅ Use class strategy, not media
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        geist: ["Geist Sans", "sans-serif"], // optional if you want `font-geist` class
      },
      fontWeight: {
        extrathin: "100",
        thin: "200",
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      colors: {
        radius: "var(--radius)",
        destructive: "var(--destructive)",
        primary: "var(--primary)",
        background: "var(--background)",
        "primary-background": "var(--background)",
        button: "var(--button)",
        "button-primary": "var(--button-primary)",
        "button-sec": "var(--button-sec)",
        text: "var(--text)",
        "sub-text": "var(--sub-text)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
};

export default config;
