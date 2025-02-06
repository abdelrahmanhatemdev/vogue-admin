import { auth } from "@/database/firebase";
import { adminAuth } from "@/database/firebase-admin";
import { cookies } from "next/headers";

export async function fetchWithAuth({
  url,
  tag,
  cache = "default",
  options = {},
}: {
  url: string;
  tag?: string;
  cache?:
    | "default"
    | "force-cache"
    | "no-cache"
    | "no-store"
    | "only-if-cached"
    | "reload";
  options?: RequestInit;
}) {

  const token = (await cookies()).get("token")?.value;

  console.log("token", token);
  

  if (token) {
    const headers = {
        ...(options.headers || {}),
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // Send the session token
    };

    return fetch(url, {
      ...options,
      headers,
      method: "GET",
      next: tag ? { tags: [tag] } : undefined,
      cache: cache || "default",
    }).then((res) => res.json())
  }

  return { error: "User not authenticated" };
}
