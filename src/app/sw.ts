import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your `injectionPoint`.
  // `injectionPoint` is an InjectManifest option.
  // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
  precacheManifest: (PrecacheEntry | string)[] | undefined;
};

installSerwist({
  precacheEntries: self.precacheManifest,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});