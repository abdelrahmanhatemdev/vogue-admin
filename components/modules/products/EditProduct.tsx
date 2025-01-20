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
import { ProductSchema } from "@/lib/validation/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editProduct } from "@/actions/Product";
import { notify } from "@/lib/utils";
import useData from "@/hooks/useData";
import { MultiSelect } from "@/components/ui/multiselect";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { OptimisicDataType } from ".";
import { Switch } from "@/components/ui/switch";

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
  const { data: categories } = useData("categories");
  const { data: brands } = useData("brands");

  const itemCatsString = item.categories as string;

  const itemCatsArray = itemCatsString?.split(",");
  const itemCatsIds = itemCatsArray.map((cat) => {
    const catArray = cat.split(" - ");
    const uuid = catArray[2];
    return uuid;
  });

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      uuid: item.uuid,
      name: item.name,
      slug: item.slug,
      categories: itemCatsIds,
      brand_id: item?.brand_id as string,
      descriptionBrief: item.descriptionBrief,
      descriptionDetails: item.descriptionDetails,
      trending: item.trending ? true : false
    },
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    setModalOpen(false);
    
    const newCategories = values.categories.map((catId) => {

      const newCat = categories.find(
        (cat) => cat.uuid === catId
      );
      if (newCat) {
        const { name, slug, uuid } = newCat
        return `${name} - ${slug} - ${uuid}`
      }
      return;
      
    }).join(",");
    const { ...rest} = values

    const updatedValues : Omit<z.infer<typeof ProductSchema>, "categories"> & { categories: string }
    = {...rest, categories: newCategories}

    const date = new Date().toISOString();
    const optimisticData = {
      id: item.id,
      ...updatedValues,
      createdAt: item.createdAt,
      updatedAt: date,
    };

    const optimisticObj: OptimisicDataType = {
      ...optimisticData,
      id: `optimisticID-${optimisticData.name}`,
      isPending: !isPending,
    };

    startTransition(() => {
      addOptimisticData((prev: Product[]) => [...prev.filter((item) => item.id !== optimisticData.id), optimisticObj]);
    });

    const reqData = {
      id: item.id,
      ...values,
      createdAt: item.createdAt,
      updatedAt: date,
    };

    const res: ActionResponse = await editProduct(reqData);
    notify(res);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-2 max-h-[70svh]  overflow-y-auto scrollbar-hide"
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
                <span className="absolute inset-0 text-red text-sm h-full w-4 flex items-center ps-2 text-neutral-700 dark:text-neutral-300">
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
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <FormLabel>Categories</FormLabel>
              {categories ? (
                <MultiSelect
                  options={categories.map((item) => ({
                    value: item.uuid,
                    label:
                      item.name?.length > 5
                        ? item.name.slice(0, 5) + ".."
                        : item.name,
                  }))}
                  onValueChange={field.onChange}
                  placeholder="Select Categories"
                  defaultValue={field.value}
                  asChild
                  className="cursor-pointer"
                />
              ) : (
                <Link href={`/categories`} className="block text-sm">
                  Add some categories to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go To Categories
                  </Button>
                </Link>
              )}
              <FormDescription>Update Product Categories</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand_id"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <FormLabel>Brand</FormLabel>
              {brands ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((item) => (
                      <SelectItem value={`${item.uuid}`} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Link href={`/brands`} className="block text-sm">
                  Add some brands to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go To Brand
                  </Button>
                </Link>
              )}
              <FormDescription>Update Product Brand</FormDescription>
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
                Update Product Description Brief
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
                Update Product Description Details
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trending"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <div className="flex justify-between items-center">
                <FormLabel>Is trending?</FormLabel>
                <FormControl>
                  <Switch
                    {...field}
                    value={`${field.value}`}
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                </FormControl>
              </div>
              <FormDescription>Is Product trending?</FormDescription>
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
