import api from "./api/axiosClient";

const url = process.env.NEXT_PUBLIC_APP_API;

export const isValidSlug = async ({
  slug,
  collection,
  uuid,
}: {
  slug: string;
  collection: string;
  uuid?: string;
}): Promise<boolean> => {
  try {

    const slugPath = collection === "products" ? `slug/` + slug + "/product":slug 

    const res = await api(`${url}/${collection}/${slugPath}`);

    const foundUuid = res?.data?.data?.uuid;

    if (foundUuid && foundUuid !== uuid) {
      return true; 
    }

    return false; 
  } catch (error) {
    // console.log("Slug check error:", error);
    return false;
  }
};


export const isValidSku = async ({
  sku,
  collection,
  uuid,
}: {
  sku: string;
  collection: string;
  uuid?: string;
}) => {
  try {
    const res = await api(`${url}/${collection}`);

    if (res) {
      const {
        data: { data: suproducts },
      } = res;

      const check = suproducts?.some(
        (sub: { id: string; sku: string; uuid: string }) => {
          if (sub.uuid === uuid) {
            return false;
          }

          return sub.sku === sku;
        }
      );

      return check;
    }
    return true;
  } catch {
    return true;
  }
};

export const isValidEmail = async ({
  email,
  collection,
  uuid,
}: {
  email: string;
  collection: string;
  uuid?: string;
}) => {
  try {
    const res = await api(`${url}/${collection}`);

    if (res) {
      const {
        data: { data },
      } = res;

      console.log("data", data);

      const check = data.some((item: { uuid: string; email: string }) => {
        if (item.uuid === uuid) {
          return false;
        }

        return item.email === email;
      });

      return check;
    }
    return true;
  } catch {
    return true;
  }
};

export const isValidCurrencyCode = async ({
  code,
  collection,
  uuid,
}: {
  code: string;
  collection: string;
  uuid?: string;
}) => {
  try {
    const res = await api(`${url}/${collection}`);

    if (res) {
      const {
        data: { data },
      } = res;

      const check = data.some((item: { uuid: string; code: string }) => {
        if (item.uuid === uuid) {
          return false;
        }

        return item.code === code;
      });

      return check;
    }
    return true;
  } catch {
    return true;
  }
};
