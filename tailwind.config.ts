import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "gray-light": {
         100: "#f9f9f9",
         200: "#f1f1f4",
         300: "#dbdfe9",
         400: "#c4cada",
         500: "#99a1b7",
         600: "#78829d",
         700: "#4b5675",
         800: "#252f4a",
         900: "#071437",
        }, 
        "gray-dark": {
          100: "#1b1c22",    
          200: "#26272f",    
          300: "#363843",    
          400: "#464852",    
          500: "#636674",    
          600: "#808290",    
          700: "#9a9cae",    
          800: "#b5b7c8",    
          900: "#f5f5f5"
         }, 
      },
    },
  },
  plugins: [],
};
export default config;
