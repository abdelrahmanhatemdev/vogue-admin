import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { RowDataPacket } from "mysql2";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { AdapterUser } from "next-auth/adapters";

interface AdminData {
  id: string;
  name: string;
  email: string;
  updatedAt: string;
  role: string;
}

interface JWT extends Record<string, unknown> {
  id?: string;
  name?: string;
  email?: string;
  updatedAt?: string;
  role?: string;
  image?: string;
}

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string; // Add the role property
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  updatedAt: string;
  role: string; // Ensure the User model also has the role property
  image?: string;
}

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

        try {
          const [result] = await db.query<(Admin & RowDataPacket)[]>(
            "SELECT * FROM admins WHERE deletedAt IS NULL AND email = ? LIMIT 1",
            [email]
          );
          const user = result[0];

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Validate password (replace this with a bcrypt hash check in production)
          const isValidPassword = await bcrypt.compare(
            password,
            user?.password ? user.password : ""
          ); // Replace with bcrypt.compare

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // Return the user object for the session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            updatedAt: user.updatedAt,
            role: "admin",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback - user:", user);
      console.log("JWT callback - token:", token);

      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
