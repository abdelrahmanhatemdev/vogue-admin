"use server";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { getOneByKeyAction } from "@/lib/actions/getOneByKeyAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/subproducts`;
const tag: string = "subproducts";
const productTag = "products";

export const getSubproducts = async () => {
  return getAllAction<Subproduct>({ url, tag });
};

export async function getSubproductBySku(sku: string) {
  return getOneByKeyAction<Subproduct>({ url: `${url}/${sku}`, tag });
}

export async function addSubproduct(data: Partial<Subproduct>) {
  return addOneAction<Subproduct>({ url, tag, data, secondTag: productTag });
}

export async function editSubproduct(
  data: Partial<
    Subproduct & {
      uuid: string;
      property: string;
      value: string | boolean | number | string[];
    }
  >
) {
  return EditOneAction<
    Subproduct & {
      uuid: string;
      property: string;
      value: string | boolean | number | string[];
    }
  >({ url, tag, data, secondTag: productTag });
}

export async function deleteSubproduct(data: { id: string }) {
  return deleteOneAction({ url, tag, data, secondTag: productTag });
}
