import { useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/database/firebase";
import axios from "axios";
import { login as loginApi } from "@/actions/auth/api";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();

      // Backend will set cookie + return user info
      const res = await loginApi({ idToken });

      console.log("use Auth", res);
      

      if (res?.success) {
        return {
          status: 200,
          message: "Login successful",
          data: { uid: res.uid, isAdmin: res.isAdmin },
        };
      }

      return {
        status: 400,
        message: res.message || "Login failed",
        errors: res.errors,
      };
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

      return {
        status: 500,
        message,
        errors: { message },
      };
    }
  };

  const logout = async () => {
    await axios.post("/api/auth/logout"); // clear cookie server-side
    await signOut(auth);
    setUser(null);
  };

  return { user, login, logout };
}
