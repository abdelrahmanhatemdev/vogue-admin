import { memo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  TfiAngleDoubleLeft,
  TfiAngleDoubleRight,
  TfiAngleLeft,
  TfiAngleRight,
} from "react-icons/tfi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationOptions {
  setPageIndex: (newPageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setFirstPage: () => void;
  setLastPage: () => void;
  setPreviousPage: () => void;
  setNextPage: () => void;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  canPrevious: boolean;
  canNext: boolean;
}

function TablePagination({
  pageIndex,
  pageSize,
  totalPages,
  canPrevious,
  canNext,
  setFirstPage,
  setLastPage,
  setPreviousPage,
  setNextPage,
  setPageIndex,
  setPageSize,
}: TablePaginationOptions) {
  let middleButtons: ReactNode = <></>;

  if (totalPages && pageIndex) {
    const pagesArray = Array.from({ length: totalPages });

    middleButtons = pagesArray.map((_, index) => {
      const displayIndex = index + 1;
      const isActive = pageIndex === displayIndex;

      const showButtons =
        pageIndex === 1
          ? [1, 2, 3]
          : pageIndex === totalPages
          ? [totalPages - 2, totalPages - 1, totalPages]
          : [pageIndex - 1, pageIndex, pageIndex + 1];

      if (showButtons.includes(displayIndex)) {
        return (
          <PaginationItem key={index}>
            <Button
              className={
                "h-6 w-6 border-neutral-400 p-3 hover:bg-neutral-200 dark:hover:bg-neutral-500" +
                (isActive
                  ? " bg-neutral-800 dark:bg-neutral-300 text-neutral-200 dark:text-neutral-800 hover:bg-neutral-900 dark:hover:bg-neutral-50 hover:text-neutral-200 dark:hover:text-neutral-800 "
                  : "")
              }
              variant="outline"
              onClick={() => setPageIndex(index)}
              aria-label={`Pagination Button ${displayIndex}`}
            >
              {displayIndex}
            </Button>
          </PaginationItem>
        );
      }
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 flex-wrap w-full lg:w-fit">
      <div className="flex gap-4 items-center">
        <div className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 min-w-fit">
          Rows Per Page
        </div>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger aria-label="Rows Per Page Select">
            <SelectValue>{pageSize}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="40">40</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 w-fit">
        Page {pageIndex} of {totalPages}
      </div>

      <Pagination className="w-full lg:justify-end lg:w-auto text-center">
        <PaginationContent>
          <PaginationItem>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={setFirstPage}
              disabled={!canPrevious}
              aria-label={`First Page`}
            >
              <TfiAngleDoubleLeft size={10} />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={setPreviousPage}
              disabled={!canPrevious}
              aria-label={`Previous Page`}
            >
              <TfiAngleLeft size={10} />
            </Button>
          </PaginationItem>
          {middleButtons}
          <PaginationItem>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={setNextPage}
              disabled={!canNext}
              aria-label={`Next Page`}
            >
              <TfiAngleRight size={10} />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={setLastPage}
              disabled={!canNext}
              aria-label={`Last Page`}
            >
              <TfiAngleDoubleRight size={10} />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default memo(TablePagination);
