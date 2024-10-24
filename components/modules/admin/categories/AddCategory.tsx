"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { DialogClose } from "@radix-ui/react-dialog";

const formSchema = z.object({
  name: z.string().max(20, {
    message: "Name should not have more than 20 charachters.",
  }),
});

export default function AddCategory() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const date = new Date().toISOString();
    const data= {
      ...values,
      createdAt: date,
      updatedAt: date,
    };

    axios
      .post(`${process.env.NEXT_APP_PUBLIC_API}/categories`, data)
      .then((res) => {
        if (res?.statusText === "OK" && res?.data?.message) {
          toast.success(res?.data?.message);
        }
        if (res?.data?.error) {
          toast.error(res?.data?.error);
        }
        console.log("res", res);
      })
      .catch((error) => {
        const message = error?.response?.data?.error || "Something Wrong";
        toast.error(message);
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Add new Category here. Click Add when you'are done.
        </DialogDescription>
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
              <DialogClose>
                <Button type="submit">Add</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
