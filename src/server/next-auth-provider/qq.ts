import { Profile, TokenSet } from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import { use } from "react";
import { env } from "~/env";


// 自定义QQ认证
export interface QQProfile extends Record<string, string | boolean | number> {
    open_id:string,
    ret: number,
    msg: string,
    is_lost: number,
    nickname: string,
    gender: string,
    gender_type: number,
    province: string,
    city: string,
    year: string,
    figureurl: string,
  //   figureurl_1: 'http://thirdqq.qlogo.cn/ek_qqapp/AQKK7RCI3eMNSh6ssAiaxqmX3ls8icMO7lQZog5gkyOLhzR42o6SyF6bMgBz1QECxRVOSoxodF/40',
  //   figureurl_2: 'http://thirdqq.qlogo.cn/ek_qqapp/AQKK7RCI3eMNSh6ssAiaxqmX3ls8icMO7lQZog5gkyOLhzR42o6SyF6bMgBz1QECxRVOSoxodF/100',
  //   figureurl_qq_1: 'http://thirdqq.qlogo.cn/ek_qqapp/AQKK7RCI3eMNSh6ssAiaxqmX3ls8icMO7lQZog5gkyOLhzR42o6SyF6bMgBz1QECxRVOSoxodF/40',
  //   figureurl_qq_2: 'http://thirdqq.qlogo.cn/ek_qqapp/AQKK7RCI3eMNSh6ssAiaxqmX3ls8icMO7lQZog5gkyOLhzR42o6SyF6bMgBz1QECxRVOSoxodF/100',
  //   figureurl_qq: 'http://thirdqq.qlogo.cn/ek_qqapp/AQKK7RCI3eMNSh6ssAiaxqmX3ls8icMO7lQZog5gkyOLhzR42o6SyF6bMgBz1QECxRVOSoxodF/0',
  //   is_yellow_vip: '0',
  //   vip: '0',
  //   yellow_vip_level: '0',
  //   level: '0',
  //   is_yellow_year_vip: '0'
}

export default function QQProvider<P extends QQProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  const callbackUrl = `${env.NEXTAUTH_URL}/api/auth/callback/qq`;
  const authorizeUrl = "https://graph.qq.com/oauth2.0/authorize";
  const tokenEndpointUrl = "https://graph.qq.com/oauth2.0/token";
  const openIdUrl = "https://graph.qq.com/oauth2.0/me";
  const userinfoUrl = "https://graph.qq.com/user/get_user_info";

  return {
    id: "qq",
    name: "QQ",
    type: "oauth",
    authorization: {
      url: authorizeUrl,
      params: {
        response_type: "code",
        client_id: options.clientId,
        redirect_uri: callbackUrl,
        state: Math.random().toString(36).substring(7),
      },
    },

    token: {
      url: tokenEndpointUrl,
      async request({ params }) {
        const url = new URL(tokenEndpointUrl);
        url.searchParams.append("grant_type", "authorization_code");
        url.searchParams.append("client_id", options.clientId);
        url.searchParams.append("client_secret", options.clientSecret);
        url.searchParams.append("redirect_uri", callbackUrl);
        url.searchParams.append("code", params.code!);
        console.log("params.code is:", params.code);
        const res = await fetch(url).then((res) => res.text());
        // access_token=48B33CDC5810FFE17A14D48903A5411C&expires_in=7776000&refresh_token=744DD8284E0D277A74BF030B94236887
        const accessToken = new URLSearchParams(res).get("access_token") ?? "";
        const tokens: TokenSet = {
          access_token: accessToken
        };
        return { tokens };
      },
    },
    userinfo: {
      url: userinfoUrl,
      async request({ tokens }) {
        const getOpenIdUrl = new URL(openIdUrl);
        getOpenIdUrl.searchParams.append("access_token", tokens.access_token ?? "");
        getOpenIdUrl.searchParams.append("fmt", "json" );
        const openIdObj = await fetch(getOpenIdUrl).then(async (res) => (await res.json()) as { "client_id": string; openid: string });
        const openId = openIdObj.openid

        const getUserInfoUrl = new URL(userinfoUrl);
        getUserInfoUrl.searchParams.append("access_token", tokens.access_token ?? "");
        getUserInfoUrl.searchParams.append("oauth_consumer_key", options.clientId);
        getUserInfoUrl.searchParams.append("openid", openId);
        const profile = await fetch(getUserInfoUrl).then(async (res) => (await res.json()) as QQProfile);
        console.log(profile.nickname)
        return {
          ...profile,
          open_id: openId
        } as Profile // 这个断言是偷懒乱写的
      },
    },
    // checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.open_id,
        name: profile.nickname,
        image: profile.figureurl
      };
    },
    style: {
      logo: "../../../next-auth/provider/icon-svg/QQ.svg",
      bg: "rgb(0,153,255)",
      text: "#fff",
    },
    options,
  };
}
