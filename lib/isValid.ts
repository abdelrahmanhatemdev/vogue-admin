import api from "./api/axiosClient";

const url = process.env.NEXT_PUBLIC_APP_API;

export const isValid = async ({
  path,
  uuid,
}: {
  path: string;
  uuid?: string;
}): Promise<boolean> => {
  try {
    const res = await api(`${url}/${path}`);

    const foundUuid = res?.data?.data?.uuid;

    if (foundUuid && foundUuid !== uuid) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};
