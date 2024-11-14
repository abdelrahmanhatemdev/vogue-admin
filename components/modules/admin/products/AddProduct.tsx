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
import { Dispatch, memo, SetStateAction, useState, useTransition } from "react";
import { addProduct } from "@/actions/Product";
import { notify } from "@/lib/utils";
import isValidSlug from "@/lib/isValidSlug";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrands, useCategories } from "@/hooks/productsHooks";
import { MultiSelect } from "@/components/ui/multiselect";
import Link from "next/link";

export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(20, {
      message: "Name should not have more than 20 charachters.",
    }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  categories: z.string(),
  brand: z.string(),
});

function AddProduct({
  setModalOpen,
  addOptimisticData,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Product[] | ((pendingState: Product[]) => Product[])
  ) => void;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      categories: "",
    },
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    const checkSlug = await isValidSlug({
      slug: values.slug,
      collection: "products",
    });

    if (!checkSlug) {
      form.setError("slug", { message: "Slug is already used!" });
      return;
    }

    setModalOpen(false);
    const date = new Date().toISOString();
    const data = {
      ...values,
      createdAt: date,
      updatedAt: date,
    };
    const optimisticObj: Product = {
      ...data,
      id: `optimisticID-${data.name}-${data.updatedAt}`,
      isPending: !isPending,
    };

    startTransition(() => {
      addOptimisticData((prev: Product[]) => [...prev, optimisticObj]);
    });
    const res: ActionResponse = await addProduct(data);
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
              <FormDescription>New Product Name</FormDescription>
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
              <FormDescription>New Product slug</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              {categories ? (
                <MultiSelect
                  options={categories.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onValueChange={setSelectedCategories}
                  defaultValue={selectedCategories}
                  placeholder="Select Categories"
                  animation={2}
                />
              ) : (
                <Link href={`/admin/categories`} className="block text-sm">
                  Add some categories to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go To Categories
                  </Button>
                </Link>
              )}
              <FormDescription>New Product Categories</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              {brands ? (
                <Select
                onValueChange={field.onChange}
                value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose brand"/>
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(item => <SelectItem value={`${item.id}`}>{item.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Link href={`/admin/brands`} className="block text-sm">
                  Add some brands to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go To Brand
                  </Button>
                </Link>
              )}
              <FormDescription>New Product Brand</FormDescription>
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

export default memo(AddProduct);
