
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // TFT cost colors
        "cost-1": "#9E9E9E", // Gray
        "cost-2": "#2E7D32", // Green
        "cost-3": "#1565C0", // Blue
        "cost-4": "#6A1B9A", // Purple
        "cost-5": "#F9A825", // Gold
        "tft-gold": "#FFD700",
        "tft-cyan": "#00FFFF",
        "tft-purple": "#9370DB",
        "tft-red": "#FF6B6B",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Exo 2", "var(--font-sans)", ...fontFamily.sans],
      },
      animation: {
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-in-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "glow": {
          "0%": {
            boxShadow: "0 0 5px rgba(155, 135, 245, 0.3)",
          },
          "100%": {
            boxShadow: "0 0 15px rgba(155, 135, 245, 0.7)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config;
