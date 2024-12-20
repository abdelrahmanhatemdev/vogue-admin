import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function notify(res: ActionResponse) {


  if (res?.status) {
    if (res.status === "200" || res.status === "success") {
      if (res?.message) {
        toast.success(res.message);
      }
    } else {
      const error = res?.message || res?.error;
      if (error) {
        toast.error(`${error}`, { duration: 8000 });
      }
    }
  }
}
