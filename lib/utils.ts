import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function notify(res: ActionResponse) {
  if (res?.status) {
    if (res.status !== "200" && res.status !== "success") {
      if (res.message) {
        toast.error(res.message);
      }
      if (res.error) {
        toast.error(res.error);
      }
    }
    if (res?.message) {
      toast.success(res.message);
    }
  }
}
