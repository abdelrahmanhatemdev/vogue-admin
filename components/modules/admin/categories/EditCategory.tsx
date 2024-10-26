"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import axios from "axios";

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
import toast from "react-hot-toast";
import { CategorySchema } from "./AddCategory";
import { Dispatch, SetStateAction } from "react";

export default function EditCategory({
  item,
  setOpen,
}: {
  item: Category;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: item.name,
    },
  });

  function onSubmit(values: z.infer<typeof CategorySchema>) {
    setOpen(false)
    const data = { id: item.id, ...values };

    axios
      .put(`${process.env.NEXT_PUBLIC_APP_API}/categories`, data)
      .then((res) => {
        if (res?.statusText === "OK" && res?.data?.message) {
          toast.success(res?.data?.message);
        }
        if (res?.data?.error) {
          toast.error(res?.data?.error);
        }
      })
      .catch((error) => {
        const message = error?.response?.data?.error || "Something Wrong";
        toast.error(message);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Update Category Name</FormDescription>
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
