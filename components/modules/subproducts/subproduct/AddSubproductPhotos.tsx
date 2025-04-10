"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction, useState, useTransition } from "react";
import { cn, notify } from "@/lib/utils";
import Image from "next/image";
import { X } from "lucide-react";
import { subproductPhotosSchema } from "@/lib/validation/subproductPhotosSchema";
import { Separator } from "@/components/ui/separator";
import type { OptimisicImagesType } from "@/components/modules/subproducts/Subproduct";
import { addProductImage } from "@/actions/Image";
import { storage } from "@/database/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export type PreviewType = {
  type: "image/jpeg" | "image/png" | "image/webp";
  size: number;
  name: string;
  src: string;
};

function AddSubproductPhotos({
  setModalOpen,
  addOptimisticData,
  subproductId,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action:
      | OptimisicImagesType[]
      | ((pendingState: OptimisicImagesType[]) => OptimisicImagesType[])
  ) => void;
  subproductId: string;
}) {
  const [images, setImages] = useState<PreviewType[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof subproductPhotosSchema>>({
    resolver: zodResolver(subproductPhotosSchema),
    defaultValues: {
      subproductId: subproductId,
      images: {
        length: 0,
        item: () => null,
        [Symbol.iterator](): ArrayIterator<File> {
          const files: File[] = [];
          for (let i = 0; i < this.length; i++) {
            const file = this.item(i);
            if (file) {
              files.push(file);
            }
          }
          return files.values();
        },
      },
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof subproductPhotosSchema>) {
    setModalOpen(false);

    if (values?.images) {
      const { images: formImages, subproductId } = values;

      const date = new Date().toISOString();

      const optimisticData = images.map((image, index) => ({
        id: `${date}-${index}`,
        uuid: `${date}-${index}`,
        url: image.src,
        subproductId: subproductId,
        sortOrder: 0,
        createdAt: date,
        updatedAt: date,
        isPending: !isPending,
      }));

      startTransition(() => {
        addOptimisticData((prev) => {
          return [...prev, ...optimisticData].sort(
            (a: ProductImage, b: ProductImage) => {
              if (a.sortOrder === b.sortOrder) {
                return b.updatedAt.localeCompare(a.updatedAt);
              }
              return a.sortOrder - b.sortOrder;
            }
          );
        });
      });

      const uploadPromises = Array.from(formImages).map(async (file) => {
        if (!(file instanceof File)) return null;

        const filePath = `products/${file.name}-${date}`;
        const fileRef = ref(storage, filePath);

        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      });

      const urls = (await Promise.all(uploadPromises)).filter(
        Boolean
      ) as string[];

      const data = {
        subproductId: subproductId,
        urls,
      };

      const res = await addProductImage(data);
      notify(res);
    }
  }

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newImages: typeof images = [];
    const dataTransfer = new DataTransfer();

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;

        newImages.push({
          type: file.type as "image/jpeg" | "image/png" | "image/webp",
          size: file.size,
          name: file.name,
          src,
        });

        dataTransfer.items.add(file);

        if (newImages.length === files.length) {
          setImages((prev) => [...prev, ...newImages]);
          form.setValue("images", dataTransfer.files);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (name: string) => {
    const updatedImages = images.filter((image) => image.name !== name);
    const dataTransfer = new DataTransfer();
    updatedImages.forEach((image) => {
      const file = Array.from(form.getValues("images")).find(
        (file) => file.name === image.name
      );
      if (file) {
        dataTransfer.items.add(file);
      }
    });
    setImages(updatedImages);
    form.setValue("images", dataTransfer.files);
  };

  const imagesContent = images.map((preview, index) => {
    const remove = (
      <X
        className="absolute end-2 top-2 text-gray-300 hover:text-gray-50 transition-colors text-[.5rem] cursor-pointer"
        size={15}
        onClick={() => removeImage(preview.name)}
      />
    );

    if (["image/jpeg", "image/png", "image/webp"].includes(preview.type)) {
      return (
        <div
          className="w-full relative rounded-md overflow-hidden"
          key={preview.name}
        >
          <Image
            key={index}
            src={preview.src}
            alt={`Preview ${index + 1}`}
            className="w-full rounded-md"
            height={100}
            width={200}
          />
          <div className="absolute inset-0 z-10 bg-black/50 flex flex-col items-center justify-center text-sm w-full h-full">
            {preview.size < 300 * 1024 ? (
              <span className="text-green-700 text-center">
                Size:{Math.ceil(preview.size / 1024)}kb
              </span>
            ) : (
              <div>
                <p className="text-destructive text-center">
                  Size:{Math.ceil(preview.size / 1024)}kb
                </p>
                <p className="text-destructive text-center">
                  Maximum size is 300kb
                </p>
              </div>
            )}
            <p className="text-white text-center p-2">{preview.name}</p>
            {remove}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full relative h-40" key={preview.name}>
        <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center text-sm w-full h-full rounded">
          <p className="text-destructive text-center text-sm">
            Only JPEG, PNG, and WEBP are allowed
          </p>
          <p className="text-white text-center p-2">{preview.name}</p>
          {remove}
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-background p-4 gap-4">
        <div className="w-full">
          <div className={cn("w-full", images.length > 0 ? "" : "h-32")}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full h-full flex flex-col gap-4"
                encType="multipart/form-data"
                id="addImages"
              >
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem className="w-full h-full">
                      <FormLabel className="border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex justify-center rounded-lg items-center cursor-pointer w-full h-full">
                        <div className="flex flex-col items-center gap-1 justify-center p-4">
                          <div>Choose Photos</div>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          multiple
                          type="file"
                          onChange={(e) => handleFileChange(e.target.files)}
                          className="hidden"
                        />
                      </FormControl>
                      <FormMessage className="text-center p-2" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-4 w-full max-h-[55vh] overflow-y-auto scrollbar-hidden">
          {imagesContent}
        </div>
      </div>
      {images.length > 0 ? (
        <>
          <Separator />
          <div className="w-full flex justify-end">
            <Button type="submit" form="addImages">
              Add photos
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default memo(AddSubproductPhotos);
