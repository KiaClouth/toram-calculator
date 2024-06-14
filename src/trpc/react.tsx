"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";
import {
  experimental_createPersister,
  type AsyncStorage,
  type PersistedQuery
} from '@tanstack/query-persist-client-core';
import { get, set, del, createStore, type UseStore } from "idb-keyval";

function newIdbStorage(idbStore: UseStore): AsyncStorage<PersistedQuery> {
  return {
    getItem: async (key) => await get(key, idbStore),
    setItem: async (key, value) => await set(key, value, idbStore),
    removeItem: async (key) => await del(key, idbStore),
  };
}

export const rApi = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const [queryClient] = useState(() => new QueryClient(
    {
      defaultOptions: {
        queries: {
          gcTime: 1000 * 60 * 60 * 12, // 12 hours
          persister: typeof window !== 'undefined' ? experimental_createPersister<PersistedQuery>({
            storage: newIdbStorage(createStore("ToramCalculator本地数据库", "LocalDB")),
            maxAge: 1000 * 60 * 60 * 12, // 12 hours,
            serialize: (persistedQuery) => persistedQuery,
            deserialize: (cached) => cached,
          }) : undefined,
          // 禁用当窗口重新聚焦时重新获取数据
          refetchOnWindowFocus: false,
        },
      },
    }
  ));

  const [trpcClient] = useState(() =>
    rApi.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer,
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
      <rApi.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </rApi.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
