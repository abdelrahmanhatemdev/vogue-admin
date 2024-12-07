import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: string;
  }

  interface User {
    id: string;
    role: string;
  }

  interface AdapterUser {
    id: string;
    role: string;
  }
}
