import Cookies from "js-cookie";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
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
  collectionName,
}: {
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  collectionName: string;
}) {
  try {
    // console.log(`Fetching ${collectionName} from Redis...`);

    // const cachedData = (await redis.get(`${collectionName}`)) as string;
    // if (cachedData) {
    //   console.log("Cache hit:", collectionName);
    //   return NextResponse.json(
    //     { data: JSON.parse(cachedData) },
    //     { status: 200 }
    //   );
    // }

    const snapShot = await collectionRef.get();

    const data = snapShot.empty
      ? []
      : snapShot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as T) }))
          .filter((doc) => !doc.deletedAt);

    // console.log(`Saving ${collectionName} to Redis with expiry...`);
    // await redis.set(collectionName, JSON.stringify(data), { ex: 3600 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("err", error);

    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
