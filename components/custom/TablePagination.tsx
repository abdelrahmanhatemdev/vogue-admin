import { Dispatch, memo, ReactNode, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import {
  TfiAngleDoubleLeft,
  TfiAngleDoubleRight,
  TfiAngleLeft,
  TfiAngleRight,
} from "react-icons/tfi";
import { PaginationState } from "@tanstack/react-table";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TablePagination ({
  canPrevious,
  canNext,
  firstPage,
  lastPage,
  previousPage,
  nextPage,
  currentPage,
  totalPages,
  pagination,
  setPagination,
}: {
  canPrevious: boolean;
  canNext: boolean;
  firstPage: () => void;
  lastPage: () => void;
  previousPage: () => void;
  nextPage: () => void;
  currentPage?: number;
  totalPages?: number;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}) {
  let middleButtons: ReactNode = <></>;

  if (totalPages && currentPage) {
    const pagesArray = Array.from({ length: totalPages });

    middleButtons = pagesArray.map((page, index) => {
      const displayIndex = index + 1;
      const isActive = currentPage === index + 1;

      const showButton =
        currentPage === 1
          ? [1, 2, 3]
          : currentPage === totalPages
          ? [totalPages - 2, totalPages - 1, totalPages]
          : [currentPage - 1, currentPage, currentPage + 1];

      if (showButton.includes(displayIndex)) {
        return (
          <PaginationItem key={index}>
            <Button
              className={
                "h-6 w-6 border-main-400 p-3 hover:bg-main-200" +
                (isActive
                  ? " bg-main-800 text-main-50 hover:bg-main-900 hover:text-main-200"
                  : "")
              }
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  pageIndex: index,
                  pageSize: prev.pageSize,
                }))
              }
              aria-label = {`Paginaion Button ${index}`}
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
        <div className="font-semibold text-sm text-neutral-700 min-w-fit">
          Rows Per Page
        </div>
        <Select
          value={`${pagination.pageSize}`}
          onValueChange={value =>
            setPagination(() => ({
              pageIndex: (currentPage ? currentPage-1: 0),
              pageSize: Number(value),
            }))
          }
        >
          <SelectTrigger aria-label="Rows Per Page Select">
            <SelectValue>{pagination.pageSize}</SelectValue>
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
      <div className="font-semibold text-sm text-neutral-700 w-fit">
        Page {currentPage} of {totalPages}
      </div>

      <Pagination className="w-full lg:justify-end lg:w-auto text-center">
        <PaginationContent>
          <PaginationItem>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={firstPage}
              disabled={!canPrevious}
              aria-label = {`First Page`}
            >
              <TfiAngleDoubleLeft size={10} />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={previousPage}
              disabled={!canPrevious}
              aria-label = {`Previous Page`}
            >
              <TfiAngleLeft size={10} />
            </Button>
          </PaginationItem>
          {middleButtons}
          <PaginationItem>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={nextPage}
              disabled={!canNext}
              aria-label = {`Next Page`}
            >
              <TfiAngleRight size={10} />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={lastPage}
              disabled={!canNext}
              aria-label = {`Last Page`}
            >
              <TfiAngleDoubleRight size={10} />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
export default memo(TablePagination);
