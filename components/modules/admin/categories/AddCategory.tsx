"use client";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Dispatch, SetStateAction } from "react";


export const CategorySchema = z.object({
  name: z.string()
  .min(1, {
    message: "Name is required"
  })
  .max(20, {
    message: "Name should not have more than 20 charachters.",
  }),
});

export default function AddCategory({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof CategorySchema>) {
    
    setOpen(false)
    const date = new Date().toISOString();
    const data = {
      ...values,
      createdAt: date,
      updatedAt: date,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_APP_API}/categories`, data)
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
        console.log(error);
        
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
              <FormDescription>New Category Name</FormDescription>
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
}
