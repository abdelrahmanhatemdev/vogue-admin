"use server";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/colors`;
const tag: string = "colors";

export const getColors = async () => {
  return getAllAction <Color>({url, tag})
};

export async function addColor(data: Partial<Color>) {
  return addOneAction<Color>({ url, tag, data });
}

export async function editColor(data: Partial<Color>) {
  return EditOneAction<Color>({ url, tag, data });
}

export async function deleteColor(data: { id: string }) {
  return deleteOneAction({url, tag, data})
}
