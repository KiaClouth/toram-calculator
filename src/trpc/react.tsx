"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";

export const tApi = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const [queryClient] = useState(() => new QueryClient(
    {
      defaultOptions: {
        queries: {
          // 默认useQuery的缓存是过期的，将此值提高为5分钟以避免windows获取到焦点时立即重新请求数据。
          // https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
          staleTime: 5 * 60 * 1000,
        },
      },
    }
  ));

  const [trpcClient] = useState(() =>
    tApi.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            return {
              cookie: props.cookies,
              "x-trpc-source": "react",
            };
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <tApi.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </tApi.Provider>
    </QueryClientProvider>
  );
}
