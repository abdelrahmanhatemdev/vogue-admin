"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Sketch } from "@uiw/react-color";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import z from "zod";
import { LabelSchema } from "@/lib/validation/labelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction } from "react";
import { addLabel } from "@/actions/Label";
import { notify } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import type { OptimisicDataType } from ".";
import useLabelStore from "@/store/useLabelStore";

function AddLabel({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof LabelSchema>>({
    resolver: zodResolver(LabelSchema),
    defaultValues: {
      uuid: uuidv4(),
      title: "",
      hex: "",
    },
    mode: "onChange",
  });

  const { data: labels, setData, fetchData: refresh } = useLabelStore();

  async function onSubmit(values: z.infer<typeof LabelSchema>) {
    setModalOpen(false);

    const date = new Date().toISOString();
    const data = {
      ...values,
      createdAt: date,
      updatedAt: date,
    };
    const optimisticObj: OptimisicDataType = {
      ...data,
      id: `optimisticID-${data.hex}-${data.updatedAt}`,
      isPending: true,
    };

    setData([...labels, optimisticObj]);

    const res: ActionResponse = await addLabel(data);
    notify(res);
    if (res?.status === "success") {
      refresh();
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
                <FormDescription>New Label Title</FormDescription>
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
                    className="min-w-full dark:!bg-neutral-900"
                    onChange={(e: { hex: string }) => {
                      form.setValue("hex", e.hex);
                      form.clearErrors("hex");
                    }}
                  />
                </FormControl>
                <FormDescription>New Hex Label Code</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Add</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default memo(AddLabel);
