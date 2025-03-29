
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
        "float": "float-animation 6s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "scale-up": "scale-up 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "ping-subtle": "ping-subtle 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(0.98)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow": {
          "0%": {
            boxShadow: "0 0 5px rgba(155, 135, 245, 0.3)",
            filter: "brightness(0.95)",
          },
          "100%": {
            boxShadow: "0 0 20px rgba(155, 135, 245, 0.7)",
            filter: "brightness(1.05)",
          },
        },
        "float-animation": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "spin": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in-up": {
          "from": { opacity: "0", transform: "translateY(15px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "ping-subtle": {
          "75%, 100%": {
            transform: "scale(1.1)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config;
