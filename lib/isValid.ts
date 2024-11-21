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
  sku,
  collection,
  id,
}: {
  sku: string;
  collection: string;
  id?: string;
}) => {
  try {
    const res = await api(`${apiURL}/${collection}`);

    if (res) {
      const {
        data: { data: products },
      } = res;

      const suproducts = products?.map(
        (product: { subproducts: { id: string; sku: string }[] }) => {
          return product.subproducts;
        }
      );
      const subsFlatArray = suproducts.flat().filter((sub: string) => sub);

      const check = subsFlatArray?.some((sub: { id: string; sku: string }) => {
        
        if (sub.id === id) {
          return false;
        }

        return sub.sku === sku;
      });

      return !check;
    }
    return true;
  } catch {
    return true;
  }
};

export { isValidSlug, isValidSku };
