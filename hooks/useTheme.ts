import ThemeContext from "@/context/themeContext";
import { useContext } from "react";

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
export default useTheme;
