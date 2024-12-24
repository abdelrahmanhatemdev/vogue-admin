"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { motion } from "framer-motion";
import { memo } from "react";
import "swiper/css";
import "swiper/css/pagination";

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
      className="h-[80svh] lg:h-full mySwiper"
      loop={true}
      autoplay={{
        delay: 5000,
      }}
    >
      <SwiperSlide className="p-4 h-full">
        <div className="relative w-full h-full">
          <Image
            src={"/assets/images/auth/bg-1.webp"}
            alt="Auth Slider image 1"
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 0vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
          <div className="w-full h-full absolute bg-neutral-800 z-[1] rounded-lg opacity-30"></div>
          <div className="absolute bottom-[20%] start-0 w-full flex flex-col gap-2 items-center">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-neutral-50 dark:text-neutral-800 lg:text-2xl 2xl:text-3xl font-extralight"
            >
              Whatever you’re thinking,
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-neutral-50 dark:text-neutral-800 lg:text-2xl 2xl:text-3xl font-extralight"
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
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 0vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="w-full h-full absolute bg-neutral-800 z-[1] rounded-lg opacity-30"></div>
          <div className="absolute bottom-[20%] start-0 w-full flex flex-col gap-2 items-center">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-neutral-50 dark:text-neutral-800 lg:text-2xl 2xl:text-3xl font-extralight"
            >
              The only way to do great work
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-neutral-50 dark:text-neutral-800 lg:text-2xl 2xl:text-3xl font-extralight"
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
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 0vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="w-full h-full absolute bg-neutral-800 z-[1] rounded-lg opacity-30"></div>
          <div className="absolute bottom-[20%] start-0 w-full flex flex-col gap-2 items-center">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-neutral-50 dark:text-neutral-800 lg:text-2xl 2xl:text-3xl font-extralight"
            >
              Every action is an opportunity
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={paragraphVariants}
              className="z-10 text-neutral-50 dark:text-neutral-800 lg:text-2xl 2xl:text-3xl font-extralight"
            >
              To improve.
            </motion.p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
export default memo(AuthSwiper);
