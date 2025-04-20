"use server";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/settings/socialMedia`;
const tag: string = "SocialMedias";

export const getSocialMedia = async () => {
  return getAllAction<SocialMedia>({ url, tag });
};

export async function addSocialMedia(data: Partial<SocialMedia>) {
  return addOneAction<SocialMedia>({ url, tag, data });
}

export async function editSocialMedia(data: Partial<SocialMedia>) {
  return EditOneAction<SocialMedia>({ url, tag, data });
}

export async function deleteSocialMedia(data: { id: string }) {
  return deleteOneAction({ url, tag, data });
}
