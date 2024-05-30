import "server-only";
import type { Locale } from "./i18n-config";
import zh_CN from "~/app/dictionaries/zh_CN"
import zh_TW from "~/app/dictionaries/zh_TW"
import en from "~/app/dictionaries/en"
import ja from "~/app/dictionaries/ja"

const dictionaries = {
  zh_CN: zh_CN,
  zh_TW: zh_TW,
  en: en,
  ja: ja,
  // zh_CN: () =>
  //   import("~/app/dictionaries/zh_CN").then((module) => module.default),
  // zh_TW: () =>
  //   import("~/app/dictionaries/zh_TW").then((module) => module.default),
  // en: () =>
  //   import("~/app/dictionaries/en").then((module) => module.default),
  // ja: () =>
  //   import("~/app/dictionaries/ja").then((module) => module.default),
};

export const getDictionary = (locale: Locale) => {
  switch (locale) {
    case "zh-CN" || "zh-HK":
      return dictionaries.zh_CN;
    case "zh-TW":
      return dictionaries.zh_TW;
    case "en" || "en-US" || "en-GB":
      return dictionaries.en;
    case "ja":
      return dictionaries.ja;
    default:
      return dictionaries.zh_CN;
  }
};
