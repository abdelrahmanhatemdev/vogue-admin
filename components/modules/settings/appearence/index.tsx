"use client";
import { memo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import useTheme from "@/hooks/useTheme";
import { Skeleton } from "@/components/ui/skeleton";

const ToggleTheme = dynamic(
  () => import("@/components/custom/ToggleThemeSwitch"),
  {
    loading: Loading,
  }
);

function Appearence() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col rounded-lg bg-background">
      <div className="flex flex-col gap-4">
        <div className="border-b border-neutral-700 pb-4 flex flex-col xs:flex-row justify-between xs:items-center w-full gap-4">
          <div>
            <h2 className="capitalize text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              Appearence
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Automatically switch between day and night themes!
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold">Theme</h3>
          <p className="text-neutral-400 text-sm">
            Select the theme for the dashboard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div
            className="flex flex-col gap-2 min-w-40 max-w-52 "
            onClick={() => theme === "dark" && toggleTheme()}
          >
            <div className="group flex flex-col gap-2 bg-neutral-200 p-2 rounded-lg hover:bg-white cursor-pointer border border-transparent hover:border-neutral-300 transition-colors">
              <div className="bg-neutral-400 group-hover:bg-neutral-300 w-full flex flex-col gap-2 p-2 rounded-md">
                <div className="bg-neutral-500 group-hover:bg-neutral-400 w-[50%] h-2 rounded-md"></div>
                <div className="bg-neutral-500 group-hover:bg-neutral-400 w-[70%] h-2 rounded-md"></div>
              </div>
              <div className="flex gap-2 bg-neutral-400 group-hover:bg-neutral-300  rounded-md items-center p-2">
                <div className="w-5 h-5 bg-neutral-500 group-hover:bg-neutral-400 rounded-full"></div>
                <div className="flex flex-col gap-2 rounded-md w-32">
                  <div className="bg-neutral-500 group-hover:bg-neutral-400 w-[50%] h-2 rounded-md"></div>
                  <div className="bg-neutral-500 group-hover:bg-neutral-400 w-[70%] h-2 rounded-md"></div>
                </div>
              </div>
              <div className="flex gap-2 bg-neutral-400 group-hover:bg-neutral-300  rounded-md items-center p-2">
                <div className="w-5 h-5 bg-neutral-500 group-hover:bg-neutral-400 rounded-full"></div>
                <div className="flex flex-col gap-2 rounded-md w-32">
                  <div className="bg-neutral-500 group-hover:bg-neutral-400 w-[80%] h-2 rounded-md"></div>
                  <div className="bg-neutral-500 group-hover:bg-neutral-400 w-[100%] h-2 rounded-md"></div>
                </div>
              </div>
            </div>
            <div className="w-full text-center text-sm">Light</div>
          </div>

          <div
            className="flex flex-col gap-2 min-w-40 max-w-52"
            onClick={() => theme !== "dark" && toggleTheme()}
          >
            <div className="group flex flex-col gap-2 bg-neutral-800 p-2 rounded-lg hover:bg-neutral-900 cursor-pointer border border-transparent hover:border-neutral-950 transition-colors">
              <div className="bg-neutral-700 group-hover:bg-neutral-800 w-full flex flex-col gap-2 p-2 rounded-md">
                <div className="bg-neutral-500 group-hover:bg-neutral-600 w-[50%] h-2 rounded-md"></div>
                <div className="bg-neutral-500 group-hover:bg-neutral-600 w-[70%] h-2 rounded-md"></div>
              </div>
              <div className="flex gap-2 bg-neutral-700 group-hover:bg-neutral-800  rounded-md items-center p-2">
                <div className="w-5 h-5 bg-neutral-500 group-hover:bg-neutral-600 rounded-full"></div>
                <div className="flex flex-col gap-2 rounded-md w-32">
                  <div className="bg-neutral-500 group-hover:bg-neutral-600 w-[50%] h-2 rounded-md"></div>
                  <div className="bg-neutral-500 group-hover:bg-neutral-600 w-[70%] h-2 rounded-md"></div>
                </div>
              </div>
              <div className="flex gap-2 bg-neutral-700 group-hover:bg-neutral-800  rounded-md items-center p-2">
                <div className="w-5 h-5 bg-neutral-500 group-hover:bg-neutral-600 rounded-full"></div>
                <div className="flex flex-col gap-2 rounded-md w-32">
                  <div className="bg-neutral-500 group-hover:bg-neutral-600 w-[80%] h-2 rounded-md"></div>
                  <div className="bg-neutral-500 group-hover:bg-neutral-600 w-[100%] h-2 rounded-md"></div>
                </div>
              </div>
            </div>
            <div className="w-full text-center text-sm">Dark</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Appearence);
