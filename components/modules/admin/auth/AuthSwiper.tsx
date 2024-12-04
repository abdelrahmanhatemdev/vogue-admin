"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

function AuthSwiper() {
  return (
    <Swiper pagination={true} modules={[Pagination]} className="h-full">
      <SwiperSlide className="p-4">
        <div className="relative w-full h-full">
          <Image
            src={"/assets/images/auth/bg-1.webp"}
            alt="Auth Slider image 1"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="w-full h-full absolute bg-main-800 z-[1] rounded-lg opacity-30"></div>
          <div className="absolute bottom-[20%] start-0 w-full flex flex-col gap-2 items-center">
            <p className="z-10 text-2xl text-main-50 text-[2rem] font-extralight">Whatever you’re thinking,</p>
            <p className="z-10 text-2xl text-main-50 text-[2rem] font-extralight">Think bigger.</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="p-4">
        <div className="relative w-full h-full">
          <Image
            src={"/assets/images/auth/bg-2.webp"}
            alt="Auth Slider image 2"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="w-full h-full absolute bg-main-800 z-[1] rounded-lg opacity-30"></div>
          <div className="absolute bottom-[20%] start-0 w-full flex flex-col gap-2 items-center">
            <p className="z-10 text-2xl text-main-50 text-[2rem] font-extralight">The only way to do great work</p>
            <p className="z-10 text-2xl text-main-50 text-[2rem] font-extralight">Is to love what you do.</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="p-4">
        <div className="relative w-full h-full">
          <Image
            src={"/assets/images/auth/bg-3.webp"}
            alt="Auth Slider image 3"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="w-full h-full absolute bg-main-800 z-[1] rounded-lg opacity-30"></div>
          <div className="absolute bottom-[20%] start-0 w-full flex flex-col gap-2 items-center">
            <p className="z-10 text-2xl text-main-50 text-[2rem] font-extralight">Every action is an opportunity</p>
            <p className="z-10 text-2xl text-main-50 text-[2rem] font-extralight">To improve.</p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
export default AuthSwiper;
