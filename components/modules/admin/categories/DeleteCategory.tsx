"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import axios from "axios";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";

export default function DeleteCategory({
  item,
  setOpen,
}: {
  item: Category;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const data = { id: item.id };
  console.log("id", item.id);

  function onSubmit() {
    setOpen(false)
    axios
      .delete(`${process.env.NEXT_PUBLIC_APP_API}/categories`, { data })
      .then((res) => {
        if (res?.statusText === "OK" && res?.data?.message) {
          toast.success(res?.data?.message);
        }
        if (res?.data?.error) {
          toast.error(res?.data?.error);
        }
      })
      .catch((error) => {
        console.log("Delete Error", error);

        const message = error?.response?.data?.error || "Something Wrong";
        toast.error(message);
      });
  }

  return (
    <DialogFooter onClick={() => onSubmit()}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </DialogFooter>
  );
}
