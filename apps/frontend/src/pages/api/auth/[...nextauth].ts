import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const env = process.env;

const useSecureCookies = env.NEXTAUTH_URL!.startsWith('https://')


export const authOptions = {
  secret: env.SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials!.email;
        const password = credentials!.password;
        try {
          const response = await axios.post(`${env.BACKEND_URL}/auth/login`, {
            email,
            password,
          },
          );

          const user = response.data;

          return user;
        } catch (error: any) {
          console.warn('Request failed with error', error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account && user) {
        return {
          accessToken: account.id_token,
          accessTokenExpires: account?.expires_at
            ? account.expires_at * 1000
            : 0,
          refreshToken: account.refresh_token,
          role: user.role,
          user,
        };
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session) {
        session.user = token.user;
        session.error = token.error;
        session.accessToken = token.accessToken;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  },
};
export default NextAuth(authOptions);
