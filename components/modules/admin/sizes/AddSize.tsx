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
import type { OptimisicDataType } from ".";

import z from "zod"
import { SizeSchema } from "@/lib/validation/sizeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  memo,
  SetStateAction,
  useTransition,
} from "react";
import { addSize } from "@/actions/Size";
import { notify } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import useData, { useRefresh } from "@/hooks/useData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function AddSize({
  setModalOpen,
  addOptimisticData,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Size[] | ((pendingState: Size[]) => Size[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof SizeSchema>>({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      uuid: uuidv4(), 
      symbol: "", 
      sort_order: 0
    },
    mode: "onChange",
  });

  const {data: sizes} = useData("sizes")

  const [isPending, startTransition] = useTransition();
  const refresh = useRefresh()

  async function onSubmit(values: z.infer<typeof SizeSchema>) {
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
    };

    startTransition(() => {
      addOptimisticData((prev: Size[]) => [...prev, optimisticObj]);
    });
    const res: ActionResponse = await addSize(data);
    notify(res);
    if (res?.status === "success") {
      refresh()
    }
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
              <FormDescription>New Size Name</FormDescription>
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
          name="sort_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Select value={`${field.value}`} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-main-200 rounded-md">
                    <SelectValue
                      placeholder="Select Currency"
                      className="truncate"
                    >
                      {field.value}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: sizes.length > 0 ? sizes.length + 1 : 1  }, (_, i) => i).map((option) => (
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
          <Button type="submit">Add</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default memo(AddSize);
