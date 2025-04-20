"use server";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/sizes`;
const tag: string = "sizes";

export const getSizes = async () => {
  return getAllAction <Size>({url, tag})
};

export async function addSize(data: Partial<Size>) {
  return addOneAction<Size>({ url, tag, data });
}

export async function editSize(data: Partial<Size>) {
  return EditOneAction<Size>({ url, tag, data });
}

export async function deleteSize(data: { id: string }) {
  return deleteOneAction({url, tag, data})
}
