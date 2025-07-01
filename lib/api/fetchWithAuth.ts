import Cookies from "js-cookie";
import { cookies } from "next/headers";
// import redis from "@/lib/redis";
export async function fetchWithAuth({
  url,
  tag,
  cache = "no-store",
  method = "GET",
  options = {},
}: {
  url: string;
  tag?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  cache?:
    | "default"
    | "force-cache"
    | "no-cache"
    | "no-store"
    | "only-if-cached"
    | "reload";
  options?: RequestInit;
}) {
  let token: string | undefined;
  if (typeof window === "undefined") {
    // Server-side cookies
    token = (await cookies()).get("token")?.value;
  } else {
    // Client-side cookies
    token = Cookies.get("token");
    console.log("client token", token?.length);
  }

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: token ? `Bearer ${token}` : "",
  };

  return fetch(url, {
    ...options,
    headers,
    method: method,
    next: tag ? { tags: [tag], revalidate: 0 } : undefined,
    cache: cache,
  });
}
