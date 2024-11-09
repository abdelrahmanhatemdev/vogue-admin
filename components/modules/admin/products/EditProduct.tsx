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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema } from "./AddProduct";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editProduct } from "@/actions/Product";
import { notify } from "@/lib/utils";
import isValidSlug from "@/lib/isValidSlug";

function EditProduct({
  item,
  setModalOpen,
  addOptimisticData,
}: {
  item: Product;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Product[] | ((pendingState: Product[]) => Product[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: item.name,
      slug: item.slug,
    },
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    const isValid = await isValidSlug({
      slug: values.slug,
      collection: "products",
      id: item.id,
    });

    if (!isValid) {
      form.setError("slug", { message: "Slug is already used!" });
      return;
    }

    setModalOpen(false);
    const data = {
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: new Date().toISOString(),
      ...values,
      isPending: !isPending,
    };

    startTransition(async () => {
      addOptimisticData((prev) => [
        ...prev.filter((item) => item.id !== data.id),
        data,
      ]);
    });

    const res: ActionResponse = await editProduct(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 lg:gap-0"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Update Product Name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="relative">
                <span className="absolute inset-0 text-red text-sm h-full w-4 flex items-center ps-2 text-main-700">
                  /
                </span>

                <FormControl>
                  <Input {...field} className="ps-4" />
                </FormControl>
              </div>
              <FormDescription>Update Product slug</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default memo(EditProduct);
