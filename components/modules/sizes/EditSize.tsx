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
import { SizeSchema } from "@/lib/validation/sizeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editSize } from "@/actions/Size";
import { notify } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSizeStore from "@/store/useSizeStore";

function EditSize({
  item,
  setModalOpen,
}: {
  item: Size;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof SizeSchema>>({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      uuid: item.uuid,
      name: item.name,
      symbol: item.symbol,
      sortOrder: item.sortOrder,
    },
  });

  const { data: sizes, setData, fetchData: refresh } = useSizeStore();

  async function onSubmit(values: z.infer<typeof SizeSchema>) {
    setModalOpen(false);
    const data = {
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: new Date().toISOString(),
      ...values,
      isPending: true,
    };

    setData([...sizes.filter((item) => item.uuid !== data.uuid), data]);

    const res: ActionResponse = await editSize(data);
    notify(res);
    if (res?.status === "success") {
      refresh();
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
              <FormDescription>Update Size Name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New Size Symbol</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Select value={`${field.value}`} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-neutral-200 dark:bg-neutral-800 rounded-md">
                    <SelectValue
                      placeholder="Select Currency"
                      className="truncate"
                    >
                      {field.value}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: sizes.length > 0 ? sizes.length : 1 },
                      (_, i) => i
                    ).map((option) => (
                      <SelectItem
                        value={`${option}`}
                        title={`${option}`}
                        className="cursor-pointer"
                        key={`${option}`}
                      >
                        {`${option}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>New Size Order</FormDescription>
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

export default memo(EditSize);
