import { memo } from "react";
import AppLayout from "./AppLayout";
import { TbExclamationMark } from "react-icons/tb";
import Image from "next/image";

const NoInternet = () => {
  return (
    <AppLayout>
      <div className="flex h-[90svh] lg:h-full w-full flex-wrap">
        <div className="w-full h-full relative flex items-center justify-center">
          <Image
            src={`/assets/images/noInternet/noInternet.png`}
            alt="Not found page"
            fill
            className="rounded-lg object-cover filter brightness-[.1]"
            // sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className="flex flex-col gap-4 items-center justify-center rounded-2xl min-w-fit lg:w-[50%] h-[50%] z-10 p-4"
            style={{ background: "hsl(0 0% 2% /40%)" }}
          >
            <div className="border-red-700 flex items-center justify-center rounded-full border-4 p-2">
              <TbExclamationMark color="red" size={50} />
            </div>
            <h1 className="text-[1.5rem] lg:text-4xl text-main-100 font-bold text-center">
              No Connection Found!
            </h1>
            <p className="text-main-100  text-center ">
              Ceck Your internet connection !
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
export default memo(NoInternet);
