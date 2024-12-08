import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { RowDataPacket } from "mysql2";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { AdminLoginSchema } from "./validation/adminAuth/adminLoginSchema";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        
          const { email, password } = credentials;

          await AdminLoginSchema.parseAsync({ email, password });

          const [result] = await db.query<(Admin & RowDataPacket)[]>(
            "SELECT * FROM admins WHERE deletedAt IS NULL AND email = ? LIMIT 1",
            [email]
          );
          const existedUser = result[0];

          if (!existedUser) {
            throw new Error("No user found with this email");
          }

          const isValidPassword = await bcrypt.compare(
            password,
            `${existedUser?.password}`
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          return {
            id: existedUser.id,
            name: existedUser.name,
            email: existedUser.email,
            updatedAt: existedUser.updatedAt,
            role: "admin",
          };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
