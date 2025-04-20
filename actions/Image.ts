"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/images`;
const tag = "productImages";
const subproductTag = "subproducts";

export const getProductImages = async () => {
  return getAllAction <ProductImage>({url, tag})
};

export async function getSubproductImages(id: string) {
  try {
    const res = await fetchWithAuth({
      url: `${url}/productImages/${id}`,
      tag,
    });

    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        return data.sort((a: ProductImage, b: ProductImage) => {
          if (a.sortOrder === b.sortOrder) {
            return b.updatedAt.localeCompare(a.updatedAt);
          }
          return a.sortOrder - b.sortOrder;
        });
      }
    }

    return [];
  } catch (error) {
    return console.log(error);
  }
}

export async function addProductImage(data: {subproductId: string; urls:string[]}) {
  return addOneAction<ProductImage>({ url, tag, data, secondTag: subproductTag });
}

export async function editProductImage(data: string[]) {
  return EditOneAction<string[]>({ url, tag, data, secondTag: subproductTag });
}

export async function deleteProductImage(data: { id: string }) {
  return deleteOneAction({url, tag, data})
}
