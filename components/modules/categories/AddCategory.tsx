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
import { Switch } from "@/components/ui/switch";

import z from "zod";
import { CategorySchema } from "@/lib/validation/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { addCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import useData, { useRefresh } from "@/hooks/useData";
import type { OptimisicDataType } from ".";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

function AddCategory({
  setModalOpen,
  addOptimisticData,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      uuid: uuidv4(),
      name: "",
      slug: "",
      label: "",
      parent: "",
      additional: false,
    },
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();
  const refresh = useRefresh();

  const { data: categories } = useData("categories");
  const { data: labels } = useData("labels");

  const parentCats = categories.filter((cat) => !cat.parent);

  async function onSubmit(values: z.infer<typeof CategorySchema>) {
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
      isPending: !isPending,
      additional: values.additional ?? false, 
      parent: values.parent ?? "",
      label: values.label ?? "",
    };

    console.log("data", data);
    

    startTransition(() => {
      addOptimisticData((prev: Category[]) => [...prev, optimisticObj]);
    });
    // const res: ActionResponse = await addCategory(data);
    // notify(res);
    // if (res?.status === "success") {
    //   refresh();
    // }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between lg:gap-2 gap-4"
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
              <FormDescription>New Category Name</FormDescription>
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
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.4rem)]">
              <FormLabel>Label</FormLabel>
              {labels ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Label" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.map((item) => (
                      <SelectItem value={`${item.uuid}`} key={item.uuid}>
                        <span
                          style={{ background: item.hex }}
                          className="p-1 rounded text-xs"
                        >
                          {item.title}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Link href={`/labels`} className="block text-sm">
                  Add some labels to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Back To labels
                  </Button>
                </Link>
              )}
              <FormDescription>New Category Label</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {parentCats.length > 0 ? (
          <FormField
            control={form.control}
            name="parent"
            render={({ field }) => (
              <FormItem className="w-full lg:w-[calc(50%-.4rem)]">
                <FormLabel>Parent</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Parent" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => !cat.parent)
                      .map((item) => (
                        <SelectItem value={`${item.uuid}`} key={item.uuid}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>New Category Parent</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="parent"
            render={({ field }) => <Input {...field} />}
          />
        )}

        <FormField
          control={form.control}
          name="additional"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <div className="flex justify-between items-center">
                <FormLabel>Is Additional?</FormLabel>
                <FormControl>
                  <Switch
                    {...field}
                    value={`${field.value}`}
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                </FormControl>
              </div>
              <FormDescription>Is New Category Additional?</FormDescription>
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

export default memo(AddCategory);
