"use server";
import api from "@/lib/axiosClient";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/auth`;


export async function login(data: {email: string, password: string;}) {
    
    
  return api
    .post(`${apiURL}/login`, data)
    .then(async (res) => {
        
      if (res?.statusText === "OK" && res?.data?.message) {
        const userCredential =  res.data.userCredential

        // const token = await userCredential.user.getIdToken()
        // console.log("user token", token);
        
        return { status: "success", message: res.data.message };
      }
      if (res?.data?.error) {
        return { status: "error", message: res.data.error };
      }
    })
    .catch((error) => {
        console.log("error: ", error);
        
      const message = error?.response?.data?.error || "Something Wrong";
      return { status: "error", message };
    });
}


