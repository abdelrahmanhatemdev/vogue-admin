import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubproductPhotosSchema } from "@/lib/validation/subproductPhotosSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Dispatch, memo, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { PreviewType } from "./Subproduct";

function SubproductPhotos({
  setPreviews,
}: {
  setPreviews: Dispatch<SetStateAction<PreviewType[]>>;
}) {
  const form = useForm<z.infer<typeof SubproductPhotosSchema>>({
    resolver: zodResolver(SubproductPhotosSchema),
    defaultValues: {
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
    console.log(values);
    console.log("form errors", form.formState.errors);
  }
  return (
    <div className="h-32 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full h-full"
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
                    {/* <div>
                      {form.formState.errors.images?.length &&
                      form.formState.errors.images?.length > 0 ? (
                        <div className="w-full text-center p-2 text-sm">
                          {Array.isArray(form.formState.errors.images) &&
                            form.formState.errors.images.map((error, index) => {
                              if (index === 0) {
                                return (
                                  <div key={index}>
                                    {error?.size?.message && (
                                      <p>{error.size.message}</p>
                                    )}
                                    {error?.type?.message && (
                                      <p>{error.type.message}</p>
                                    )}
                                  </div>
                                );
                              }
                              return <></>;
                            })}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div> */}
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    multiple
                    type="file"
                    onChange={async (e) => {
                      const files = e.target.files;

                      if (files && files.length > 0) {
                        field.onChange(files);

                        const fileArray = Array.from(files).map((file) => ({
                          type: file.type as
                            | "image/jpeg"
                            | "image/png"
                            | "image/webp",
                          size: file.size,
                          name: file.name,
                        }));

                        const newPreviews: {
                          type: "image/jpeg" | "image/png" | "image/webp";
                          size: number;
                          name: string;
                          src: string;
                        }[] = [];

                        Array.from(files).forEach((file) => {
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onloadend = () => {
                            const previewObj = {
                              type: file.type as
                                | "image/jpeg"
                                | "image/png"
                                | "image/webp",
                              size: file.size,
                              name: file.name,
                              src: reader.result as string,
                            };
                            newPreviews.push(previewObj);
                            if (newPreviews.length === files.length) {
                              setPreviews(newPreviews);
                            }
                          };
                        });

                        await handleSubmit({ images: files });
                      }
                    }}
                    className="hidden"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
export default memo(SubproductPhotos);
