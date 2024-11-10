import type { User as FirebaseUser } from "firebase/auth";
import { createContext } from "react";

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
