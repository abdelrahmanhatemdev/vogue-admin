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
import { Dispatch, SetStateAction, useContext, useTransition } from "react";
import { addCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import { OptimisticContext } from ".";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(20, {
      message: "Name should not have more than 20 charachters.",
    }),
});

export default function AddCategory({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const [isPendin, startTransition] = useTransition()

  const { addOptimisticData } = useContext(OptimisticContext);

  async function onSubmit(values: z.infer<typeof CategorySchema>) {
    setOpen(false);
    const date = new Date().toISOString();
    const data = {
      ...values,
      createdAt: date,
      updatedAt: date,
    };
    const optimisticObj: Category = {
      ...data,
      id: `optimisticID-${data.name}-${data.updatedAt}`,
      isPending: true,
    };

    startTransition( async () => {
      addOptimisticData((prev: Category[]) => [...prev, optimisticObj]);
    });
    const res: ActionResponse = await addCategory(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New Category Name</FormDescription>
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
