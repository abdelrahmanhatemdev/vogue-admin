import { User, UserPermission } from "@/types/auth";
import { create } from "zustand";

const useUser = create((set) => ({
  user: {
    user: null,
    userPermission: null,
  },
  setUser: (user: User) => set({ user }),
  setUserPermission: (userPermission: UserPermission) =>
    set({ userPermission }),
}));

export default useUser;