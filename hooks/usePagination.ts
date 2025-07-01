import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';

interface PaginationParams {
  limit?: number;
  cursor?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

interface UsePaginationOptions<T> {
  tag: string;
  getList: (params: PaginationParams) => Promise<PaginatedResponse<T>>;
  limit?: number;
}

function usePagination<T>({
  tag,
  getList,
  limit= 10,
}: UsePaginationOptions<T>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<
    PaginatedResponse<T>,                    
    Error,                                  
    InfiniteData<PaginatedResponse<T>>,      
    [string, number],                       
    string | null                            
  >({
    queryKey: [tag, limit],
    initialPageParam: null,
    queryFn: ({ pageParam }) =>  getList({ limit, cursor: pageParam ?? undefined }),
    getNextPageParam: (lastPage) => {
      console.log("lastpage", lastPage);
      
      return lastPage.nextCursor},
  });

  return {
    items: data?.pages.flatMap((page) => page.data) ?? [],
    total: data?.pages?.[0]?.total ?? 0,
    fetchNextPage,
    hasNextPage,
    isLoading: isFetching && !data,
    isFetchingNextPage,
    refetch,
  };
}

export default usePagination;