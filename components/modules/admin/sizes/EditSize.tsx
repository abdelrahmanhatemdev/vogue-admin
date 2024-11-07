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
import { SizeSchema } from "./AddSize";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editSize } from "@/actions/Size";
import { notify } from "@/lib/utils";

function EditSize({
  item,
  setModalOpen,
  addOptimisticData,
}: {
  item: Size;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Size[] | ((pendingState: Size[]) => Size[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof SizeSchema>>({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      name: item.name,
    },
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof SizeSchema>) {
    setModalOpen(false);
    const data = {
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: new Date().toISOString(),
      ...values,
      isPending: !isPending ,
    };

    startTransition(async () => {
      addOptimisticData((prev) => [
        ...prev.filter((item) => item.id !== data.id),
        data,
      ]);
    });

    const res: ActionResponse = await editSize(data);
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
              <FormDescription>Update Size Name</FormDescription>
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

export default memo(EditSize)
