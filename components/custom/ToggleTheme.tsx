"use client";
import useTheme from "@/hooks/useTheme";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function ToggleTheme() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="p-1 dark:hover:bg-neutral-700 hover:bg-neutral-200 rounded-full w-8 h-8 transition-colors" title="Theme">
      <Button
        onClick={toggleTheme}
        className="w-full h-full flex justify-center items-center p-0"
        variant={"nostyle"}
        aria-label="Theme Switch"
        title="Switch Theme"
      >
        {theme !== "dark" && <div className="bg-sky-600 text-sky-50 rounded-full p-1">
          <IoMoonSharp
            size={14}
          />
        </div>}
        {theme === "dark" && <div className="bg-neutral-950 text-yellow-500 rounded-full p-1">
          <IoSunnyOutline
            size={14}
          />
        </div>}
        
      </Button>
    </div>
  );
}
export default ToggleTheme;
