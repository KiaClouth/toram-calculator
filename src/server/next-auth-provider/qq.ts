import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth"
import { env } from "~/env";

// https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100255473&response_type=code&redirect_uri=https%3A%2F%2Fnote.youdao.com%2Flogin%2Facc%2Fcallback&state=P4OLJZhLwpVPKOLPK6LJz0ZZZZZ4OM6F0
// https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=102088467&scope=openid&response_type=code&redirect_uri=https%3A%2F%2Fapp.kiaclouth.com%2Fapi%2Fauth%2Fcallback%2Fqq&state=5eFUFTJipaH5gNbYgiE3TX9z-jQsrMVqj4uIxPW1xG4&code_challenge=os3KODLmic5aU5IArbOPsqQJsFpwY36ddY4CtWrSHig&code_challenge_method=S256
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
      authorization: {
        url: "https://graph.qq.com/oauth2.0/authorize",
        params: { 
          response_type: "code",
          client_id: options.clientId,
          redirect_uri: `${env.NEXTAUTH_URL}/api/auth/callback/qq`,
          state: Math.random().toString(36).substring(7)
        }
        },
        token: {
            url: "https://graph.qq.com/oauth2.0/token",
            params: {
                grant_type: "authorization_code",
                client_id: options.clientId,
                client_secret: options.clientSecret,
                code:""
            }
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
      style: { logo: '../../../next-auth/provider/icon-svg/QQ.svg', bg: "rgb(0,153,255)", text: "#fff" },
      options,
    }
  }