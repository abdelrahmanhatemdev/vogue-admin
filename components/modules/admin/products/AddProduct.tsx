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
import { addProduct } from "@/actions/Product";
import { notify } from "@/lib/utils";
import isValidSlug from "@/lib/isValidSlug";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import useSWR from "swr" 

const fetcher = (url:string) => fetch(url).then((res) => res.json());

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
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const {isLoading , data, error} = useSWR(`${process.env.NEXT_PUBLIC_APP_API}/categories`, fetcher)

  console.log("isLoading", isLoading);
  console.log("data", data);
  console.log("error", error);
  
  


  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    const isValid = await isValidSlug({
      slug: values.slug,
      collection: "products",
    });

    if (!isValid) {
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

                <FormControl>
                  <Select {...field} >
                    <SelectTrigger>
                      Category
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cate"></SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              <FormDescription>New Product Categories</FormDescription>
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
