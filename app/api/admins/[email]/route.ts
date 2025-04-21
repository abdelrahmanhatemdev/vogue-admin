import { collectionRef } from "@/app/api/admins/route";
import { getOneActiveByKey } from "@/lib/api/routes/getOneActiveByKey";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.pathname.split("/").pop();

  return getOneActiveByKey<Brand>({ collectionRef, value: email, key: "email" });
}
