import Cookies from "js-cookie";
// import redis from "@/lib/redis";
export async function fetchWithAuth({
  url,
  tag,
  cache = "force-cache",
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
  const token = Cookies.get("token");

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
    next: tag ? { tags: [tag] } : undefined,
    cache: cache,
  });
}

