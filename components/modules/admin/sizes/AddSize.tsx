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
import { useRefresh } from "@/hooks/useData";

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
      uuid: uuidv4()
    },
    mode: "onChange",
  });

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
        <DialogFooter>
          <Button type="submit">Add</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default memo(AddSize);
