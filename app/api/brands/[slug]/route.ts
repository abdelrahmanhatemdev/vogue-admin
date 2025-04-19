import { collectionRef } from "@/app/api/brands/route";
import { getOneActiveByKey } from "@/lib/api/getOneActiveByKey";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop();

  return getOneActiveByKey<Brand>({ collectionRef, value: slug });
}
