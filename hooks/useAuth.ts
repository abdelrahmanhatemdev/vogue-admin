import { useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/database/firebase";
import axios from "axios";
import { FirebaseError } from "firebase/app";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const idToken = await result.user.getIdToken();
      const res = await axios.post("/api/auth/login", { idToken });
      const user = { ...result.user, isAdmin: res.data.isAdmin };
      setUser(user);
      return user;
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            message = "Invalid email format.";
            break;
          case "auth/user-disabled":
            message = "This account has been disabled.";
            break;
          case "auth/user-not-found":
            message = "No account found with this email.";
            break;
          case "auth/wrong-password":
            message = "Incorrect password.";
            break;
          case "auth/too-many-requests":
            message = "Too many attempts. Try again later.";
            break;
          default:
            message = error.message;
            break;
        }
      }

      console.error("Login error:", error);
      throw new Error(message);
    }
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    await signOut(auth);
    setUser(null);
  };

  return { user, login, logout };
}
