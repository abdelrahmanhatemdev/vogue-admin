"use server";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/categories`;

export async function getCategories() {
  try {
    const res = await fetch(apiURL, {
      next: { revalidate: 10, tags: ["categories"] },
    });
    let data: Category[] = [];

    if (res) {
      const { data } = await res.json();

      const sortedData = data.sort((a: Category, b: Category) =>
        b.updatedAt.localeCompare(a.updatedAt)
      );

      return sortedData;
    }
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function getCategoryById(id: string) {
  try {
    const res = await fetch(`${apiURL}/${id}`, {
      next: { revalidate: 10, tags: ["categories"] },
    });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}
