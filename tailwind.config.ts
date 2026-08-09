import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/themes/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       screens: {
        xxs: '320px', // custom breakpoint for small screens
        xs: '375px', // custom breakpoint for small screens
        m: '425px', // custom breakpoint for small screens
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
        // AquaMist theme fonts
        'eb-garamond': ['EB Garamond', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        "slide-in-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        // AquaMist float animation
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "slide-in-left": "slide-in-left 0.5s ease-in-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-in-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        customGray: "#f4f4f4",
        // ─── AquaMist (HumidAura) Theme Palette ───────────────────────────
        "aq-primary": "#bdfff3",
        "aq-primary-container": "#7de8d8",
        "aq-primary-fixed": "#8af5e5",
        "aq-primary-fixed-dim": "#6dd8c9",
        "aq-on-primary": "#003731",
        "aq-on-primary-container": "#00685e",
        "aq-on-primary-fixed": "#00201c",
        "aq-on-primary-fixed-variant": "#005048",
        "aq-secondary": "#c9bffa",
        "aq-secondary-container": "#4a4275",
        "aq-secondary-fixed": "#e5deff",
        "aq-secondary-fixed-dim": "#c9bffa",
        "aq-on-secondary": "#31295a",
        "aq-on-secondary-container": "#bbb1eb",
        "aq-on-secondary-fixed": "#1c1344",
        "aq-on-secondary-fixed-variant": "#474072",
        "aq-tertiary": "#f1f1ff",
        "aq-tertiary-container": "#d1d5eb",
        "aq-tertiary-fixed": "#dee1f7",
        "aq-tertiary-fixed-dim": "#c2c6db",
        "aq-on-tertiary": "#2b3040",
        "aq-on-tertiary-container": "#575c6e",
        "aq-on-tertiary-fixed": "#161b2b",
        "aq-on-tertiary-fixed-variant": "#414658",
        "aq-surface": "#121414",
        "aq-surface-dim": "#121414",
        "aq-surface-bright": "#37393a",
        "aq-surface-variant": "#333535",
        "aq-surface-tint": "#6dd8c9",
        "aq-surface-container": "#1e2020",
        "aq-surface-container-low": "#1a1c1c",
        "aq-surface-container-high": "#282a2b",
        "aq-surface-container-highest": "#333535",
        "aq-surface-container-lowest": "#0c0f0f",
        "aq-on-surface": "#e2e2e2",
        "aq-on-surface-variant": "#bcc9c6",
        "aq-inverse-surface": "#e2e2e2",
        "aq-inverse-on-surface": "#2f3131",
        "aq-inverse-primary": "#006a60",
        "aq-background": "#121414",
        "aq-on-background": "#e2e2e2",
        "aq-outline": "#879390",
        "aq-outline-variant": "#3d4947",
        "aq-error": "#ffb4ab",
        "aq-error-container": "#93000a",
        "aq-on-error": "#690005",
        "aq-on-error-container": "#ffdad6",
        // ──────────────────────────────────────────────────────────────────
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
