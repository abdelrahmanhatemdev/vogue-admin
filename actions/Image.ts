
import api from "@/lib/axiosClient";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/images`;
export const tag = "products";

export async function addImage(data: FileList) {

  console.log("addImage data", data);
  
  return api
    .post(apiURL, data)
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        return { status: "success", message: res.data.message };
      }
      if (res?.data?.error) {
        return { status: "error", message: res.data.error };
      }
    })
    .catch((error) => {
      const message = error?.response?.data?.error || "Something Wrong";
      return { status: "error", message };
    });
}

// export async function editProduct(data: Partial<Product>) {
//   return api
//     .put(apiURL, data)
//     .then((res) => {
//       if (res?.statusText === "OK" && res?.data?.message) {
//         revalidateTag(tag);
//         return { status: "success", message: res.data.message };
//       }
//       if (res?.data?.error) {
//         return { status: "error", message: res.data.error };
//       }
//     })
//     .catch((error) => {
//       const message = error?.response?.data?.error || "Something Wrong";
//       return { status: "error", message };
//     });
// }

// export async function deleteProduct(data: { id: string }) {
//   return api
//     .delete(apiURL, { data })
//     .then((res) => {
//       if (res?.statusText === "OK" && res?.data?.message) {
//         revalidateTag(tag);
//         return { status: "success", message: res.data.message };
//       }
//       if (res?.data?.error) {
//         return { status: "error", message: res.data.error };
//       }
//     })
//     .catch((error) => {
//       const message = error?.response?.data?.error || "Something Wrong";
//       return { status: "error", message };
//     });
// }
