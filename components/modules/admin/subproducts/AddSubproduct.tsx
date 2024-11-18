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

export const SubproductSchema = z.object({
  sku: z
    .string()
    .min(1, {
      message: "SKU is required",
    })
    .max(12, {
      message: "SKU should not have more than 20 charachters.",
    }),
  colors: z.array(z.string()).nonempty({
    message: "Choose at least one color",
  }),
  sizes: z.array(z.string()).nonempty({
    message: "Choose at least one size",
  }),
  price: z.coerce.number().min(1, {
    message: "Price is required",
  }),
  discount: z.coerce
    .number()
    .min(1, {
      message: "Discount is required",
    })
    .max(100, {
      message: "Discount cannot be more than 100%",
    }),
  qty: z.coerce.number(),
  sold: z.coerce.number(),
  featured: z.boolean(),
  inStock: z.boolean(),
});
import {v4 as uuid4} from "uuid"

function AddSubproduct({
  setModalOpen,
  addOptimisticData,
  productId
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Subproduct[] | ((pendingState: Subproduct[]) => Subproduct[])
  ) => void;
  productId: string
}) {
  const { data: colors } = useData("colors");
  const { data: sizes } = useData("sizes");

  const form = useForm<z.infer<typeof SubproductSchema>>({
    resolver: zodResolver(SubproductSchema),
    defaultValues: {
      featured: false,
      inStock: true,
    },
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof SubproductSchema>) {

    setModalOpen(false);
    const date = new Date().toISOString();
    const data = {
      id: uuid4(),
      ...values,
      productId,
      createdAt: date,
      updatedAt: date,
    };

    const optimisticObj: Subproduct = {
      ...data,
      isPending: !isPending,
    };

    console.log("isPending", isPending);
    

    startTransition(() => {
      addOptimisticData((prev: Subproduct[]) => [...prev, optimisticObj]);
    });
    const res: ActionResponse = await addSubproduct(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-2"
      >
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New Subproduct SKU</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="colors"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <FormLabel>Colors</FormLabel>
              {colors ? (
                <MultiSelect
                  options={colors.map((item) => ({
                    value: item.id,
                    label:
                      item.name?.length > 5
                        ? item.name.slice(0, 5) + ".."
                        : item.name,
                  }))}
                  onValueChange={field.onChange}
                  placeholder="Select Colors"
                  asChild
                  className="cursor-pointer"
                />
              ) : (
                <Link href={`/admin/colors`} className="block text-sm">
                  Add some colors to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go to colors
                  </Button>
                </Link>
              )}
              <FormDescription>New subproduct colors</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <FormLabel>Sizes</FormLabel>
              {sizes ? (
                <MultiSelect
                  options={sizes.map((item) => ({
                    value: item.id,
                    label:
                      item.name?.length > 5
                        ? item.name.slice(0, 5) + ".."
                        : item.name,
                  }))}
                  onValueChange={field.onChange}
                  placeholder="Select sizes"
                  asChild
                  className="cursor-pointer"
                />
              ) : (
                <Link href={`/admin/sizes`} className="block text-sm">
                  Add some sizes to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go to sizes
                  </Button>
                </Link>
              )}
              <FormDescription>New subproduct sizes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New subproduct price</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>discount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New subproduct discount</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qty</FormLabel>
              <FormControl>
                <Input {...field}/>
              </FormControl>
              <FormDescription>New subproduct qty</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sold</FormLabel>
              <FormControl>
                <Input {...field}/>
              </FormControl>
              <FormDescription>New subproduct sold</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <div className="flex justify-between items-center">
                <FormLabel>Featured</FormLabel>
                <FormControl>
                  <Switch
                    {...field}
                    value={`${field.value}`}
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                </FormControl>
              </div>
              <FormDescription>New subproduct is Featured</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inStock"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <div className="flex justify-between items-center">
                <FormLabel>In Stock</FormLabel>
                <FormControl>
                  <Switch
                    {...field}
                    value={`${field.value}`}
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                </FormControl>
              </div>
              <FormDescription>New subproduct is InStock</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="w-full">
          <Button type="submit">Add</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default memo(AddSubproduct);
