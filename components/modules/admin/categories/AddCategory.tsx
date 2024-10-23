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
import { HiOutlinePlus } from "react-icons/hi2";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function AddCategory() {
  const form = useForm();

// const formSchema = 

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
          <form action="">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <input {...field}/>
                    </FormControl>
                    <FormDescription>
                        Your Category Name
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
