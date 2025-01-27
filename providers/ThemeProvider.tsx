'use client';
import ThemeContext from "@/context/themeContext";
import { ReactNode, useEffect, useState } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && localStorage.getItem("light") === "light"
      ? "light"
      : "dark"
  );

  useEffect(() => {
    const doc = window.document.documentElement;
    if (theme === "dark") {
      doc.classList.add("dark");
    } else {
      doc.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
