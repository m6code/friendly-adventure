import { useState } from 'react';
import {
  QueryClientProvider, QueryClient, QueryCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { RETRY_TIME, STALE_TIME_IN_MS } from '@/constants/Constants';

// query provider is placed within browser router to enable redirecting users from this provider
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // query client is placed in state to prevent cache loss
  // when browser router re-renders due to route change
  const [queryClient] = useState(new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_IN_MS,
        refetchOnWindowFocus: false,
        retry: RETRY_TIME,
      },
    },
    queryCache: new QueryCache({
      // GET request error is handled at global level
      onError: () => {
      },
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
