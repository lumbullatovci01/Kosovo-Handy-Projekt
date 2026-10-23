import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    jwt({ token, profile }) {
      if (profile?.login) token.login = String(profile.login);
      return token;
    },
    session({ session, token }) {
      (session.user as { login?: string }).login = token.login as string | undefined;
      return session;
    },
  },
});