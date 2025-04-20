"use server";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/settings/setting`;
const tag: string = "Settings";

export const getSetting = async () => {
  return getAllAction <Setting>({url, tag})
};

export async function editSetting(data: Partial<Setting>) {
  return EditOneAction<Setting>({ url, tag, data });
}
