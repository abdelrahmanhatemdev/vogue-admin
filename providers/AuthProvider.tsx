"use client"
import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { auth } from "@/firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<AuthContextType["loading"]>(true);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setUser(user);
    });
    unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
