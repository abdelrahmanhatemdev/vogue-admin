"use server";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { getOneByKeyAction } from "@/lib/actions/getOneByKeyAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/brands`;
const tag: string = "brands";

export const getBrands = async () => {
  return getAllAction<Brand>({ url, tag });
};

export async function getBrandBySlug(slug: string) {
  return getOneByKeyAction<Brand>({ url: `${url}/${slug}`, tag });
}

export async function addBrand(data: Partial<Brand>) {
  return addOneAction<Brand>({ url, tag, data });
}

export async function editBrand(data: Partial<Brand>) {
  return EditOneAction<Brand>({ url, tag, data });
}

export async function deleteBrand(data: { id: string }) {
  return deleteOneAction({ url, tag, data });
}
