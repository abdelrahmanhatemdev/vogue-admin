import { auth } from "@/firebase/firebaseClient.config";

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
    }
  } catch (error) {
    return { error };
  }
};

export const logoutUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/auth/logout`, {
      method: "GET",
    });
    if (res.ok) {
      console.log("User Logged out successfully!");

      localStorage.removeItem("token");
    } else {
      const data = await res.json();
      console.log(data.error);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getToken = async () => {
    const user = auth.currentUser
    if (user) {
        return user.getIdToken()
    }
    return null
}