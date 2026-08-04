"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/lib/types/employee";

type UsePaginatedQueryOptions<T> = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<PaginatedResponse<T>>;
};

export function usePaginatedQuery<T>({
  queryKey,
  queryFn
}: UsePaginatedQueryOptions<T>) {
  return useQuery({
    queryKey,
    queryFn
  });
}
