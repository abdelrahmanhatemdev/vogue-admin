"use client";
import useTheme from "@/hooks/useTheme";
import { Switch } from "@/components/ui/costom-switch";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";

function ToggleTheme() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  if (!mounted) return;

  return (
    <div className="relative w-14 h-7" title="Theme">
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-between cursor-pointer px-[.30rem]"
        onClick={toggleTheme}
      >
        <div className="bg-sky-600 text-sky-50 rounded-full p-[.2rem]">
          <IoMoonSharp size={14} className={`${theme === "dark" ? "block" : "hidden"}`}/>
        </div>
        <div className="bg-yellow-200 text-yellow-700 rounded-full p-[.2rem]">
          <IoSunnyOutline size={14}  className={`${theme !== "dark" ? "block" : "hidden"}`}/>
        </div>
      </div>
      <Switch
        checked={theme === "dark" ? true : false}
        onCheckedChange={toggleTheme}
        className="w-14 h-7 bg-sky-600"
      />
    </div>
  );
}
export default ToggleTheme;
