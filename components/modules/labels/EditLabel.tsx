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
import { LabelSchema } from "@/lib/validation/labelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editLabel } from "@/actions/Label";
import { notify } from "@/lib/utils";
import { Sketch } from "@uiw/react-color";
import { useRefresh } from "@/hooks/useData";

function EditLabel({
  item,
  setModalOpen,
  addOptimisticData,
}: {
  item: Label;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Label[] | ((pendingState: Label[]) => Label[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof LabelSchema>>({
    resolver: zodResolver(LabelSchema),
    defaultValues: {
      title: item.title,
      uuid: item.uuid,
      hex: item.hex,
    },
  });

  const [isPending, startTransition] = useTransition();
  const refresh = useRefresh()

  async function onSubmit(values: z.infer<typeof LabelSchema>) {
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

    const res: ActionResponse = await editLabel(data);
    notify(res);
    if (res?.status === "success") {
      refresh()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col lg:flex-row gap-2 lg:justify-between">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Update Label Title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hex"
            render={() => (
              <FormItem>
                <FormLabel>Hex Code</FormLabel>
                <FormControl>
                  <Sketch
                    color={item.hex}
                    className="min-w-full dark:!bg-neutral-900"
                    onChange={(e: { hex: string }) => {
                      form.setValue("hex", e.hex);
                      form.clearErrors("hex");
                    }}
                  />
                </FormControl>
                <FormDescription>Update Hex Label Code</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default memo(EditLabel);
