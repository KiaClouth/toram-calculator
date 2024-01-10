// import { authenticate } from "@/services/authService"
import NextAuth from "next-auth";
import type {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials, req) {
        if (typeof credentials !== "undefined") {
          // 认证邮件和密码是否正确
          // const res = await authenticate(credentials.email, credentials.password)
          // if (typeof res !== "undefined") {
          //     // 使用Ts的小伙伴需要自己重新声明一下User接口，要么编辑器会提示没有apiToken等其他多余的属性
          //     return { ...res.user, apiToken: res.token }
          // } else {
          //     return null
          // }
          console.log(credentials);
          return null;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {strategy: "jwt"},
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
