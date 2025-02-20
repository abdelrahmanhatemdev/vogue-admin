
"use client"
import useTheme from "@/hooks/useTheme";
import Loader from "react-spinners/PuffLoader";

function Loading() {
  const { theme } = useTheme();

  const isDark = theme === "dark" ? true : false;

  return (
    <div className="flex w-full h-full items-center justify-center">
      <Loader
        color={isDark ? "hsl(0 0% 80%)" : "hsl(0 0% 20%)"}
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loading;
