"use client";
import Image from "next/image";
import { Dispatch, memo, SetStateAction } from "react";
// import Image from "next/image";

function PhotoViewer({
  src
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  src: string;
}) {
  return (
    <div className="flex justify-center items-center">
      <Image
        src={src}
        alt="Photo Viewer"
        className="rounded-lg w-auto h-[80svh]"
        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
        priority={true}
        width={400}
        height={200}
      />
    </div>
  );
}

export default memo(PhotoViewer);
