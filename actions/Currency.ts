"use server";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/settings/currencies`;
const tag: string = "currency";

export const getCurrencies = async () => {
  return getAllAction <Currency>({url, tag})
};

export async function addCurrency(data: Partial<Currency>) {
 return addOneAction<Currency>({ url, tag, data });
}

export async function editCurrency(data: Partial<Currency>) {
  return EditOneAction<Currency>({ url, tag, data });
}

export async function deleteCurrency(data: { id: string }) {
  return deleteOneAction({url, tag, data})
}
