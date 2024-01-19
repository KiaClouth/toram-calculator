/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import withSerwistInit from "@serwist/next";
await import("./src/env.js");

const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    injectionPoint: "precacheManifest"
});
         
export default withSerwist({
    reactStrictMode: true, // Enable React strict mode for improved error handling
    swcMinify: true, // Enable SWC minification for improved performance
    // compiler: {
    //   removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
    // },
});
