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
import { ColorSchema } from "@/lib/validation/colorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editColor } from "@/actions/Color";
import { notify } from "@/lib/utils";
import { Sketch } from "@uiw/react-color";
import { useRefresh } from "@/hooks/useData";

function EditColor({
  item,
  setModalOpen,
  addOptimisticData,
}: {
  item: Color;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Color[] | ((pendingState: Color[]) => Color[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof ColorSchema>>({
    resolver: zodResolver(ColorSchema),
    defaultValues: {
      name: item.name,
      uuid: item.uuid,
      hex: item.hex,
    },
  });

  const [isPending, startTransition] = useTransition();
  const refresh = useRefresh()

  async function onSubmit(values: z.infer<typeof ColorSchema>) {
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

    const res: ActionResponse = await editColor(data);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Update Color Name</FormDescription>
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
                <FormDescription>Update Hex Color Code</FormDescription>
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

export default memo(EditColor);
