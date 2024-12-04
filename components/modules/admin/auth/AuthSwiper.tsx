"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { motion } from "framer-motion";

function AuthSwiper() {
  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };
  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      modules={[Pagination, Autoplay]}
      className="h-full mySwiper"
      loop={true}
      autoplay={{
        delay: 5000,
      }}
    >
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
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-2xl text-main-50 text-[2rem] font-extralight"
            >
              Whatever you’re thinking,
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-2xl text-main-50 text-[2rem] font-extralight"
            >
              Think bigger.
            </motion.p>
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
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-2xl text-main-50 text-[2rem] font-extralight"
            >
              The only way to do great work
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-2xl text-main-50 text-[2rem] font-extralight"
            >
              Is to love what you do.
            </motion.p>
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
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-2xl text-main-50 text-[2rem] font-extralight"
            >
              Every action is an opportunity
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-2xl text-main-50 text-[2rem] font-extralight"
            >
              To improve.
            </motion.p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
export default AuthSwiper;
