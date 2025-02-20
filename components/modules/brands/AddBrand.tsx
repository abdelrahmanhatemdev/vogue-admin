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
import { BrandSchema } from "@/lib/validation/brandSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction } from "react";
import { addBrand } from "@/actions/Brand";
import { notify } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import type { OptimisicDataType } from ".";
import useBrandStore from "@/store/useBrandStore";

function AddBrand({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof BrandSchema>>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      uuid: uuidv4(),
      name: "",
      slug: "",
    },
    mode: "onChange",
  });

  const { fetchData: refresh, data: brands, setData } = useBrandStore();

  async function onSubmit(values: z.infer<typeof BrandSchema>) {
    setModalOpen(false);
    const date = new Date().toISOString();
    const data = {
      ...values,
      createdAt: date,
      updatedAt: date,
    };
    const optimisticObj: OptimisicDataType = {
      ...data,
      id: `optimisticID-${data.name}-${data.updatedAt}`,
      isPending: true,
    };

    setData([...brands, optimisticObj]);

    const res: ActionResponse = await addBrand(data);
    notify(res);
    if (res?.status === "success") {
      refresh();
    }
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
              <FormDescription>New Brand Name</FormDescription>
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
                <span className="absolute inset-0 text-red text-sm h-full w-4 flex items-center ps-2 text-neutral-700 dark:text-neutral-300">
                  /
                </span>

                <FormControl>
                  <Input {...field} className="ps-4" />
                </FormControl>
              </div>
              <FormDescription>New Category slug</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Add</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default memo(AddBrand);
