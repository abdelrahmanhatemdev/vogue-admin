"use server";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/settings/globalNotifications`;
const tag: string = "GlobalNotifications";

export const getGlobalNotification = async () => {
  return getAllAction<GlobalNotification>({ url, tag });
};

export async function addGlobalNotification(data: Partial<GlobalNotification>) {
  return addOneAction<GlobalNotification>({ url, tag, data });
}

export async function editGlobalNotification(
  data: Partial<GlobalNotification>
) {
  return EditOneAction<GlobalNotification>({ url, tag, data });
}

export async function deleteGlobalNotification(data: { id: string }) {
  return deleteOneAction({ url, tag, data });
}
