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

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  memo,
  SetStateAction,
  useTransition,
} from "react";
import { addBrand } from "@/actions/Brand";
import { notify } from "@/lib/utils";
import {isValidSlug} from "@/lib/isValid";

export const BrandSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(20, {
      message: "Name should not have more than 20 charachters.",
    }),
    slug: z.string()
});

function AddBrand({
  setModalOpen,
  addOptimisticData,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Brand[] | ((pendingState: Brand[]) => Brand[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof BrandSchema>>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof BrandSchema>) {
    setModalOpen(false);
    const date = new Date().toISOString();
    const data = {
      ...values,
      createdAt: date,
      updatedAt: date,
    };
    const optimisticObj: Brand = {
      ...data,
      id: `optimisticID-${data.name}-${data.updatedAt}`,
      isPending: !isPending,
    };

    startTransition(() => {
      addOptimisticData((prev: Brand[]) => [...prev, optimisticObj]);
    });
    const res: ActionResponse = await addBrand(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-0">
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
                        collection: "brands",
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
};

export default memo(AddBrand);
