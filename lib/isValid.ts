import api from "./axiosClient";

const apiURL = process.env.NEXT_PUBLIC_APP_API;

export const isValidSlug = async ({
  slug,
  table,
  uuid,
}: {
  slug: string;
  table: string;
  uuid?: string;
}) => {
  try {
    const res = await api(`${apiURL}/${table}`);

    if (res) {
      const {
        data: { data },
      } = res;

      const check = data.some((item: { uuid: string; slug: string }) => {
        if (item.uuid === uuid) {
          return false;
        }

        return item.slug === slug;
      });

      return check;
    }
    return true;
  } catch {
    return true;
  }
};

export const isValidSku = async ({
  sku,
  table,
  uuid,
}: {
  sku: string;
  table: string;
  uuid?: string;
}) => {
  try {
    const res = await api(`${apiURL}/${table}`);

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
  table,
  uuid,
}: {
  email: string;
  table: string;
  uuid?: string;
}) => {
  try {
    const res = await api(`${apiURL}/${table}`);

    if (res) {
      const {
        data: { data },
      } = res;

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
  table,
  uuid,
}: {
  code: string;
  table: string;
  uuid?: string;
}) => {
  try {
    const res = await api(`${apiURL}/${table}`);

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
