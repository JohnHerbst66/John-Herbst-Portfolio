import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14181D",       // base background, charcoal-navy (not pure black)
        panel: "#1B222B",     // card/panel background
        panelline: "#28323D", // panel border
        blueprint: "#5B9BD9", // primary structural accent
        blueprintdim: "#3E6FA8",
        signal: "#E8A33D",    // sparse status/live accent
        paper: "#E7EAEE",     // primary text, cool off-white
        muted: "#8B96A5",     // secondary text
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(91,155,217,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(91,155,217,0.07) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
export default config;
