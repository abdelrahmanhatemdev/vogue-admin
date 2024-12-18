import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SubproductPhotosSchema } from "@/lib/validation/subproductPhotosSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import { Dispatch, memo, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type PreviewType = {
  type: "image/jpeg" | "image/png" | "image/webp";
  size: number;
  name: string;
  src: string;
};

function AddSubproductPhotos({ subproductId }: { subproductId: string }) {
  const [images, setImages] = useState<PreviewType[]>([]);

  const form = useForm<z.infer<typeof SubproductPhotosSchema>>({
    resolver: zodResolver(SubproductPhotosSchema),
    defaultValues: {
      productId: subproductId,
      images: {
        length: 0,
        item: (index: number) => null,
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

  async function handleSubmit(values: z.infer<typeof SubproductPhotosSchema>) {
    if (values?.images) {
      const { images, productId } = values;

      const imagesArr = Array.from(images);

      const formData = new FormData();
      formData.append("productId", productId);

      imagesArr.forEach((image) => formData.append("files", image));

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/images`, {
          method: "POST",
          body: formData,
        });

        console.log("res", res);
      } catch (error) {
        console.log(error);
      }
    }
    // console.log(values);
    // console.log("form errors", form.formState.errors);
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

        // Sync state and form once all files are processed
        if (newImages.length === files.length) {
          setImages((prev) => [...prev, ...newImages]); // Update state
          form.setValue("images", dataTransfer.files); // Update form field
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (name: string) => {
    const updatedImages = images.filter((image) => image.name !== name);

    // Create a new FileList excluding the removed file
    const dataTransfer = new DataTransfer();
    updatedImages.forEach((image) => {
      const file = Array.from(form.getValues("images")).find(
        (file) => file.name === image.name
      );
      if (file) {
        dataTransfer.items.add(file);
      }
    });

    setImages(updatedImages); // Update state
    form.setValue("images", dataTransfer.files); // Update form field
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
          className="w-full lg:h-32 lg:w-auto relative rounded-md overflow-hidden"
          key={preview.name}
        >
          <Image
            key={index}
            src={preview.src}
            alt={`Preview ${index + 1}`}
            className="w-full lg:w-auto lg:h-32 rounded-md"
            height={100}
            width={200}
          />
          <div className="absolute inset-0 z-10 bg-black bg-opacity-80 flex flex-col items-center justify-center text-sm w-full h-full">
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
      <div className="w-full lg:h-32 lg:w-64 relative" key={preview.name}>
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
    <div className="flex flex-col lg:flex-row bg-background p-4 gap-4">
      <div className="lg:min-w-52">
        <div className="h-32 w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-4"
              encType="multipart/form-data"
            >
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="w-full h-full">
                    <FormLabel className="border border-dashed border-main-300 bg-main-100 hover:bg-main-200 flex justify-center rounded-lg items-center h-full cursor-pointer w-full">
                      <div className="flex flex-col items-center gap-1 justify-center">
                        <div>Choose Photos</div>
                        <FormMessage className="text-center p-2" />
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
                  </FormItem>
                )}
              />
              <Separator />
              <div className="w-full flex justify-end">
                <Button type="submit">Add photos</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-4 mx-auto">
        {imagesContent}
      </div>
    </div>
  );
}
export default memo(AddSubproductPhotos);
