"use server";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/labels`;
const tag: string = "labels";

export const getLabels = async () => {
  return getAllAction <Label>({url, tag})
};

export async function addLabel(data: Partial<Label>) {
  return addOneAction<Label>({ url, tag, data });
}

export async function editLabel(data: Partial<Label>) {
  return EditOneAction<Label>({ url, tag, data });
}

export async function deleteLabel(data: { id: string }) {
  return deleteOneAction({url, tag, data})
}
