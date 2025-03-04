import Cookies from "js-cookie";
import { NextResponse } from "next/server";

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

export async function fetchAllActive<T extends Record<string, string>>({
  collectionRef,
}: {
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
}) {
 
     try {
        const snapShot = await collectionRef.get();
    
        const data = snapShot.empty
      ? []
      : snapShot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as T) }))
          .filter((doc) => !doc.deletedAt);
    
        return NextResponse.json({ data }, { status: 200 });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something Wrong";
        return NextResponse.json({ error: message }, { status: 500 });
      }
   
}
