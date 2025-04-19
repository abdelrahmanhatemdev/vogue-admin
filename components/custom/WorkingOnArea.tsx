import useTheme from "@/hooks/useTheme";
import Image from "next/image";
import { memo } from "react";

const WorkingOnArea = () => {
    const { theme } = useTheme();

    const isLight = theme ? (theme === "light" ? true : false) : false;
  return (
    <div className="flex flex-col gap-4 justify-center items-center p-4 lg:mx-20 lg:p-10">
      <div className="border border-dashed rounded-md">
        <Image
          src={`/assets/images/working-on${isLight ? "-light" : ""}.png`}
          alt="Working Area"
          className="rounded-lg"
          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
          width={400}
          height={200}
        />
      </div>
      <h2>Working Area</h2>
    </div>
  );
};
export default memo(WorkingOnArea);
