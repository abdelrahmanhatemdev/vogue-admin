"use server";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";
import { getManyByKeyAction } from "@/lib/actions/getManyByKeyAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/images`;
const tag = "productImages";
const subproductTag = "subproducts";

export const getProductImages = async () => {
  return getAllAction<ProductImage>({ url, tag });
};

export async function getSubproductImages(id: string) {
  return getManyByKeyAction<ProductImage>({
    url: `${url}/productImages/${id}`,
    tag,
  });
}

export async function addProductImage(data: {
  subproductId: string;
  urls: string[];
}) {
  return addOneAction<ProductImage>({
    url,
    tag,
    data,
    secondTag: subproductTag,
  });
}

export async function editProductImage(data: {
  subproductId: string;
  list: string[];
}) {
  return EditOneAction<{
    subproductId: string;
    list: string[];
  }>({ url, tag, data, secondTag: subproductTag });
}

export async function deleteProductImage(data: { id: string }) {
  return deleteOneAction({ url, tag, data });
}
