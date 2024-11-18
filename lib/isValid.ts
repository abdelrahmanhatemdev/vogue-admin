import api from "./axiosClient";

const apiURL = process.env.NEXT_PUBLIC_APP_API;
const isValidSlug = async ({
  slug,
  collection,
  id,
}: {
  slug: string;
  collection: string;
  id?: string;
}) => {
  try {
    const res = await api(`${apiURL}/${collection}`);

    if (res) {
      const {
        data: { data },
      } = res;

      const check = data.some((item: { id: string; slug: string }) => {
        if (item.id === id) {
          return false;
        }

        return item.slug === slug;
      });

      return !check;
    }
    return true;
  } catch {
    return true;
  }
};

const isValidSku = async ({
  productId,
  sku,
  collection,
  id,
}: {
  productId: string;
  sku: string;
  collection: string;
  id?: string;
}) => {
  try {
    const res = await api(`${apiURL}/${collection}/id/${productId}`);

    if (res) {
      const {
        data: { data },
      } = res;

      const check = data?.subproducts.some((item: { id: string; sku: string }) => {
        if (item.id === id) {
          return false;
        }

        return item.sku === sku;
      });

      return !check;
    }
    return true;
  } catch {
    return true;
  }
};

export { isValidSlug, isValidSku };
