import { NextResponse } from "next/server";
import { getBrands } from "@/actions/Brand";
import { collectionRef } from "@/app/api/brands/route";
import { getOneActiveBySlug } from "@/lib/api/getOneActiveBySlug";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;

  const { slug } = await params;

  return getOneActiveBySlug<Brand>({collectionRef, slug});
}

export async function generateStaticParams() {
  const list: Brand[] = await getBrands();

  return list?.length > 0
    ? list.map(({ slug }: { slug: string }) => ({ slug }))
    : [];
}
