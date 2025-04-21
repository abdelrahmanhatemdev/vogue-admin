import { collectionRef } from "@/app/api/settings/currencies/route";
import { getOneActiveByKey } from "@/lib/api/routes/getOneActiveByKey";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.pathname.split("/").pop();

  return getOneActiveByKey<Brand>({ collectionRef, value: code, key: "code"});
}
