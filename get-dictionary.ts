import "server-only";
import type { Locale } from "./i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () =>
    import("~/app/dictionaries/en.json").then((module) => module.default),
  zh_CN: () =>
    import("~/app/dictionaries/zh_CN.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (locale === "zh-CN") {
    return dictionaries.zh_CN();
  } else {
    return dictionaries[locale]?.() ?? dictionaries.zh_CN();
  }
}
  

  
