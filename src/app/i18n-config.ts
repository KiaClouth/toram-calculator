export const i18n = {
  defaultLocale: "zh-CN",
  locales: ["zh-CN", "zh-TW", "zh-HK", "en", "en-US", "en-GB", "ja"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
