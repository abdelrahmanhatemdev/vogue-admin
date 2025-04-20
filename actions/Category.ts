"use server";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { getOneByKeyAction } from "@/lib/actions/getOneByKeyAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/categories`;
const tag: string = "categories";

export const getCategories = async () => {
  return getAllAction<Category>({ url, tag });
};

export async function getCategoryBySlug(slug: string) {
  return getOneByKeyAction<Category>({ url: `${url}/${slug}`, tag });
}

export async function addCategory(data: Partial<Category>) {
  return addOneAction<Partial<Category>>({ url, tag, data });
}

export async function editCategory(
  data: Partial<
    Category & {
      uuid: string;
      property: string;
      value: string | boolean | number | string[];
    }
  >
) {
  return EditOneAction<
    Category & {
      uuid: string;
      property: string;
      value: string | boolean | number | string[];
    }
  >({ url, tag, data });
}

export async function deleteCategory(data: { id: string }) {
  return deleteOneAction({ url, tag, data });
}
