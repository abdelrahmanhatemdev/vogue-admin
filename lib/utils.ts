import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TOAST_ID = "global-toast";

export function notify(res: ActionResponse) {
  if (!res?.status) return;

  const isSuccess = res.status === "200" || res.status === "success";
  const message = res.message || res.error;

  if (!message) return;

  toast[isSuccess ? "success" : "error"](message, {
    id: TOAST_ID,
    duration: isSuccess ? 4000 : 8000,
  });
}

