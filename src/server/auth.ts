import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"

import { env } from "~/env";
import { db } from "~/server/db";

import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        email: user.email
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    QQProvider({
      clientId: env.QQ_CLIENT_ID,
      clientSecret: env.QQ_CLIENT_SECRET,
      httpOptions: {
        timeout: 50000
      }
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      httpOptions: {
        timeout: 50000
      }
    }),
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      httpOptions: {
        timeout: 50000
      }
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD
        }
      },
      from: env.EMAIL_FROM,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  secret: env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: '/uth/signIn'
  // }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

// 自定义QQ认证
export interface QQProfile extends Record<string, string | boolean | number> {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  hd: string
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  picture: string
  sub: string
}

export default function QQProvider<P extends QQProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "qq",
    name: "QQ",
    type: "oauth",
    wellKnown: "https://wiki.connect.qq.com/%e8%8e%b7%e5%8f%96%e7%94%a8%e6%88%b7openid_oauth2-0",
    authorization: {
      url: "https://graph.qq.com/oauth2.0/authorize",
      params: { scope: "openid email profile" }
    },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    style: { logo: "~/../public/next-auth/provider/icon-svg/QQ.svg", bg: "#fff", text: "#000" },
    options,
  }
}
