import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Apple from "next-auth/providers/apple";
import { createServiceClient } from "@/lib/supabase/server";

import type { NextAuthConfig } from "next-auth";

const config: NextAuthConfig = {
  providers: [
    Google({
      authorization: { params: { scope: "openid" } },
    }),
    GitHub,
    Apple({
      authorization: { params: { scope: "openid" } },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days

  callbacks: {
    async signIn({ account }) {
      if (!account) return false;

      try {
        const supabase = createServiceClient();

        const { error } = await supabase
          .from("users")
          .upsert(
            {
              oauth_id: account.providerAccountId,
              provider: account.provider,
            },
            { onConflict: "oauth_id,provider" }
          );

        if (error) {
          console.error("User upsert failed:", error);
          return false;
        }

        return true;
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }
    },

    async jwt({ token, account }) {
      // On initial sign-in, fetch the internal user ID
      if (account) {
        const supabase = createServiceClient();

        const { data } = await supabase
          .from("users")
          .select("id")
          .eq("oauth_id", account.providerAccountId)
          .eq("provider", account.provider)
          .single();

        if (data) {
          token.userId = data.id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = { id: token.userId as string } as typeof session.user;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
