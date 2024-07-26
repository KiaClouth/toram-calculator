import "server-only";
import type { Locale } from "./i18n-config";
import zh_CN from "~/app/dictionaries/zh_CN"
import zh_TW from "~/app/dictionaries/zh_TW"
import en from "~/app/dictionaries/en"
import ja from "~/app/dictionaries/ja"

export const getDictionary = (locale: Locale) => {
  switch (locale) {
    case "zh-CN" || "zh-HK":
      return zh_CN;
    case "zh-TW":
      return zh_TW;
    case "en" || "en-US" || "en-GB":
      return en;
    case "ja":
      return ja;
    default:
      return zh_CN;
  }
};
