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
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { CategorySchema } from "@/lib/validation/categorySchema";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import { useRefresh } from "@/hooks/useData";

function EditCategory({
  item,
  setModalOpen,
  addOptimisticData,
}: {
  item: Category;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: item.name,
      slug: item.slug,
      uuid: item.uuid,
    },
  });

  const [isPending, startTransition] = useTransition();
  const refresh = useRefresh()

  async function onSubmit(values: z.infer<typeof CategorySchema>) {
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

    const res: ActionResponse = await editCategory(data);
    notify(res);
    if (res?.status === "success") {
      refresh()
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
              <FormDescription>Update Category Name</FormDescription>
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
              <FormDescription>Update Category slug</FormDescription>
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

export default memo(EditCategory);
