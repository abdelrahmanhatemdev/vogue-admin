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
import { ColorSchema } from "@/lib/validation/colorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { addColor } from "@/actions/Color";
import { notify } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import type { OptimisicDataType } from ".";
import useColorStore from "@/store/useColorStore";

function AddColor({
  setModalOpen
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  
}) {
  const form = useForm<z.infer<typeof ColorSchema>>({
    resolver: zodResolver(ColorSchema),
    defaultValues: {
      uuid: uuidv4(),
      name: "",
      hex: "",
    },
    mode: "onChange",
  });


  const {data: colors, setData, fetchData: refresh}  =  useColorStore();

  async function onSubmit(values: z.infer<typeof ColorSchema>) {
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

   
    setData( [...colors, optimisticObj]);
    
    const res: ActionResponse = await addColor(data);
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
                <FormDescription>New Color Name</FormDescription>
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
                <FormDescription>New Hex Color Code</FormDescription>
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

export default memo(AddColor);
