"use client";
import { Button } from "../ui/button";
import useTheme from "@/hooks/useTheme";
function ToggleTheme() {
    const { theme, toggleTheme } = useTheme();
  return (
    <Button onClick={toggleTheme}>
      <span>{theme}</span>
    </Button>
  );
}
export default ToggleTheme;
