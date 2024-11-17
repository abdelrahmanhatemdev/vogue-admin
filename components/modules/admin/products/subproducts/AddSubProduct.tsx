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
import { addSubProduct } from "@/actions/Subproduct";
import { notify } from "@/lib/utils";
import isValidSlug from "@/lib/isValidSlug";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useData from "@/hooks/useData";
import { MultiSelect } from "@/components/ui/multiselect";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export const SubProductSchema = z.object({
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
  price: z.string().min(1, {
    message: "Price is required",
  }),
  discount: z
    .string()
    .min(1, {
      message: "Discount is required",
    })
    .max(100, {
      message: "Discount cannot be more than 100%",
    }),
  qty: z.number(),
  sold: z.boolean(),
  featured: z.boolean(),
  inStock: z.boolean(),
  descriptionDetails: z.string().min(1, {
    message: "Description Details is required",
  }),
});

function AddSubProduct({
  setModalOpen,
  addOptimisticData,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: SubProduct[] | ((pendingState: SubProduct[]) => SubProduct[])
  ) => void;
}) {
  const { data: categories } = useData("categories");
  const { data: brands } = useData("brands");

  const form = useForm<z.infer<typeof SubProductSchema>>({
    resolver: zodResolver(SubProductSchema),
    defaultValues: {
      name: "",
      categories: [],
      brand: "",
      descriptionBrief: "",
      descriptionDetails: "",
    },
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof SubProductSchema>) {
    setModalOpen(false);
    const date = new Date().toISOString();
    const data = {
      ...values,
      createdAt: date,
      updatedAt: date,
    };
    const optimisticObj: SubProduct = {
      ...data,
      id: `optimisticID-${data.name}-${data.updatedAt}`,
      isPending: !isPending,
    };

    startTransition(() => {
      addOptimisticData((prev: SubProduct[]) => [...prev, optimisticObj]);
    });
    const res: ActionResponse = await addSubProduct(data);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New SubProduct Name</FormDescription>
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
                  <Input
                    {...field}
                    className="ps-4"
                    onChange={async (e) => {
                      field.onChange(e.target.value);

                      const checkSlug: boolean = await isValidSlug({
                        slug: e.target.value,
                        collection: "SubProducts",
                      });

                      if (!checkSlug) {
                        form.setError("slug", {
                          message: "Slug is already used!",
                        });
                        return;
                      } else {
                        form.clearErrors("slug");
                      }
                    }}
                  />
                </FormControl>
              </div>
              <FormDescription>New SubProduct slug</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="lg:w-[calc(50%-.75rem)]">
              <FormLabel>Categories</FormLabel>
              {categories ? (
                <MultiSelect
                  options={categories.map((item) => ({
                    value: item.id,
                    label:
                      item.name?.length > 5
                        ? item.name.slice(0, 5) + ".."
                        : item.name,
                  }))}
                  onValueChange={field.onChange}
                  placeholder="Select Categories"
                  asChild
                  className="cursor-pointer"
                />
              ) : (
                <Link href={`/admin/categories`} className="block text-sm">
                  Add some categories to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go To Categories
                  </Button>
                </Link>
              )}
              <FormDescription>New SubProduct Categories</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem className="lg:w-[calc(50%-.75rem)]">
              <FormLabel>Brand</FormLabel>
              {brands ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((item) => (
                      <SelectItem value={`${item.id}`} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
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
              <FormDescription>New SubProduct Brand</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descriptionBrief"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description Brief</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Add Description Brief" />
              </FormControl>
              <FormDescription>
                New SubProduct Description Brief
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descriptionDetails"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description Details</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add Description Brief"
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                New SubProduct Description Details
              </FormDescription>
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

export default memo(AddSubProduct);
