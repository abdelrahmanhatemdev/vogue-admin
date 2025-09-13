import { useTheme } from "@/store/useTheme";
import { ReactNode, useEffect } from "react";

function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme((state) => state.theme);

  useEffect(() => {
    const doc = document.documentElement;
    if (theme === 'dark') {
      doc.classList.add('dark');
    } else {
      doc.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

export default ThemeProvider;