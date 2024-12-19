"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { addSubproduct } from "@/actions/Subproduct";
import { notify } from "@/lib/utils";
import useData from "@/hooks/useData";
import { MultiSelect } from "@/components/ui/multiselect";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubproductSchema } from "@/lib/validation/subproductSchema";
import { OptimisicDataType } from "../products/Product";
import { currencies } from "@/constants/currencies";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

import { OptimisicImagesType } from "./Subproduct";

function PhotoSlider({
  setModalOpen,
  images,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  images: OptimisicImagesType[];
}) {
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
        </div>
      </SwiperSlide>
    </Swiper>
  );
}

export default memo(PhotoSlider);
