import useSWR from "swr";
import { useState } from "react";

const PAGE_SIZE = 10;

interface GetListParams {
  limit?: number;
  cursor?: string;
}

interface GetListResult<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

interface UsePaginationOptions<T> {
  tag: string;
  getList: (params: GetListParams) => Promise<GetListResult<T>>;
}

function usePagination<T>({ tag, getList }: UsePaginationOptions<T>) {
  const [cursor, setCursor] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR<GetListResult<T>>(
    [`/api/${tag}`, cursor],
    () => getList({ limit: PAGE_SIZE, cursor: cursor ?? undefined }),
    { keepPreviousData: true }
  );

  const nextPage = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  return {
    data: data?.data ?? [],
    nextCursor: data?.nextCursor,
    total: data?.total ?? 0,
    isLoading,
    error,
    nextPage,
    mutate,
  };
}

export default usePagination;
