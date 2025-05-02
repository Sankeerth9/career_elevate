import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  urlOrMethod: string,
  urlOrOptions?: string | {
    method?: string;
    body?: unknown;
  },
  optionalData?: unknown,
): Promise<T> {
  let url: string;
  let method: string = 'GET';
  let data: unknown | undefined;

  // Handle different argument patterns
  if (urlOrOptions && typeof urlOrOptions === 'object') {
    // Case: apiRequest('/url', { method, body })
    url = urlOrMethod;
    method = urlOrOptions.method || 'GET';
    data = urlOrOptions.body;
  } else if (urlOrOptions && typeof urlOrOptions === 'string') {
    // Case: apiRequest('POST', '/url', data)
    method = urlOrMethod;
    url = urlOrOptions;
    data = optionalData;
  } else {
    // Case: apiRequest('/url')
    url = urlOrMethod;
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
