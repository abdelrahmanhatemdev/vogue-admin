"use client";
import { Dispatch, memo, SetStateAction } from "react";
import Image from "next/image";

import type { OptimisicImagesType } from "@/components/modules/subproducts/Subproduct";
const uploadsPath = `${process.env.NEXT_PUBLIC_APP_UPLOADS}/images`;

function PhotoViewer({
  src
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  src: string;
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={src}
        alt="Photo Viewer"
        className="rounded-lg"
        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
        // priority={true}
        width={400}
        height={200}
      />
    </div>
  );
}

export default memo(PhotoViewer);
