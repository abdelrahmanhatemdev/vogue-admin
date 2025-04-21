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
import { categorySchema } from "@/lib/validation/categorySchema";
import { Dispatch, memo, SetStateAction } from "react";
import { editCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import useCategoryStore from "@/store/useCategoryStore";
import useLabelStore from "@/store/useLabelStore";

function EditCategory({
  item,
  setModalOpen,
}: {
  item: Category;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: item.name,
      slug: item.slug,
      uuid: item.uuid,
      label: item.label,
      parent: item.parent,
      additional: item.additional ? true : false,
    },
  });

  

  const { data: categories, fetchData: refresh, setData } = useCategoryStore();
  const { data: labels } = useLabelStore();

  const parentCats = categories.filter((cat) => !cat.parent);

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    setModalOpen(false);
    const data = {
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: new Date().toISOString(),
      ...values,
      label: values.label ?? "",
      parent: values.parent === " " ? "" : values.parent ?? "",
      additional: values.additional ? true : false,
      isPending: true,
    };

    setData([...categories.filter((item) => item.uuid !== data.uuid), data]);

    const res: ActionResponse = await editCategory(data);
    notify(res);
    if (res?.status === "success") {
      refresh();
    }
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
            <FormItem className="w-full lg:w-[calc(50%-.4rem)]">
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
            <FormItem className="w-full lg:w-[calc(50%-.4rem)]">
              <FormLabel>Slug</FormLabel>
              <div className="relative">
                <span className="absolute inset-0 text-red text-sm h-full w-4 flex items-center ps-2 text-neutral-700 dark:text-neutral-300">
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
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.4rem)]">
              <FormLabel>Label</FormLabel>
              {labels ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Label" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.map((item: Label) => (
                      <SelectItem value={`${item.uuid}`} key={item.uuid}>
                        <span
                          style={{ background: item.hex }}
                          className="p-1 rounded-lg text-xs"
                        >
                          {item.title}
                        </span>
                      </SelectItem>
                    ))}
                    <SelectItem value=" " key="noLabel">
                      No Label
                    </SelectItem>
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
        {parentCats.length > 0 && (
          <FormField
            control={form.control}
            name="parent"
            render={({ field }) => (
              <FormItem className="w-full lg:w-[calc(50%-.4rem)]">
                <FormLabel>Parent</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Parent" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCats.map((item) => (
                      <SelectItem value={`${item.uuid}`} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                    <SelectItem value=" " key="noParent">
                      No Parent
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>New Category Parent</FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default memo(EditCategory);
