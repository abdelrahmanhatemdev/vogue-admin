"use client";
import { Dispatch, memo, SetStateAction, useTransition } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";

import { OptimisicImagesType } from "./Subproduct";

function PhotoViewer({
  image,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  image: OptimisicImagesType;
}) {
  const {isPending, src} = image
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Image
        src={isPending ? src : `/api/images/src${src}`}
        alt="Auth Slider image 1"
        className="rounded-lg"
        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
        priority={true}
        width={400}
        height={200}
      />
    </div>
  );
}

export default memo(PhotoViewer);
