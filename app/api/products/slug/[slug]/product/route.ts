import { collectionRef } from "@/app/api/products/route";
import { getOneActiveByKey } from "@/lib/api/getOneActiveByKey";


export const dynamic = "force-static";

export async function GET(
  request: Request
) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");

  const slug = segments[segments.length-2]

  return getOneActiveByKey<Brand>({ collectionRef, value: slug });
}


