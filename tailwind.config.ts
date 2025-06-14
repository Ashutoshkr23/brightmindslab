import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F39C12",     // vibrant orange (buttons, highlights)
        secondary: "#3498DB",   // cool blue (tabs, labels)
        success: "#2ECC71",     // green (correct, progress)
        danger: "#E74C3C",      // red (wrong answers)
        background: "#1F2937",  // dark slate (app background)
        light: "#EAEAEA",       // light text
        dark: "#111827"         // pure dark
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        heading: ["'Outfit'", "sans-serif"],
      },
      borderRadius: {
        xl: "1.25rem",
        '2xl': "1.5rem",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
} satisfies Config;
