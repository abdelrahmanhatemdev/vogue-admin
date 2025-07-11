"use server";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { getOneByKeyAction } from "@/lib/actions/getOneByKeyAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/admins`;
const tag: string = "admins";

export const getAdmins = async (params?: {
  limit?: number;
  cursor?: string;
}) => {
  const query = new URLSearchParams();

  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.cursor) query.set("cursor", params.cursor);

  const paramUrl = `${url}?${query.toString()}`;
  return getAllAction<Admin>({ url:paramUrl, tag});
};

export async function getAdminById(uuid: string) {
  return getOneByKeyAction<Admin>({ url: `${url}/${uuid}`, tag });
}

export async function addAdmin(data: Partial<Admin>) {
  return addOneAction<Admin>({ url, tag, data });
}

export async function editAdmin(data: Partial<Admin>) {
  return EditOneAction<Admin>({ url, tag, data });
}

export async function deleteAdmin(data: { id: string; uid: string }) {
  return deleteOneAction({ url, tag, data });
}
