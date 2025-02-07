import { cookies } from "next/headers";

export async function fetchWithAuth({
  url,
  tag,
  cache = "force-cache",
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

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "", // Send the session token
  };

  return fetch(url, {
    ...options,
    headers,
    method: "GET",
    next: tag ? { tags: [tag] } : undefined,
    cache: cache || "force-cache",
  });
}
