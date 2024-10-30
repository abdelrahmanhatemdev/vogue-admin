import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function notify(res: ActionResponse) {
  if (res?.status && res?.message) {
    res.status === "success"
      ? toast.success(res.message)
      : toast.error(res.message);
  }
}
