import "server-only";
import type { Locale } from "./i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  zh_CN: () =>
    import("~/app/dictionaries/zh_CN.json").then((module) => module.default),
  zh_TW: () =>
    import("~/app/dictionaries/zh_TW.json").then((module) => module.default),
  en: () =>
    import("~/app/dictionaries/en.json").then((module) => module.default),
  ja: () =>
    import("~/app/dictionaries/ja.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  switch (locale) {
    case "zh-CN" || "zh-HK":
      return dictionaries.zh_CN();
    case "zh-TW":
      return dictionaries.zh_TW();
    case "en" || "en-US" || "en-GB":
      return dictionaries.en();
    case "ja":
      return dictionaries.ja();
    default:
      return dictionaries.en();
  }
};
