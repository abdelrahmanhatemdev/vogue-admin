import { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";

import {
  TfiAngleDoubleLeft,
  TfiAngleDoubleRight,
  TfiAngleLeft,
  TfiAngleRight,
} from "react-icons/tfi";
import { PaginationState } from "@tanstack/react-table";

const TablePagination = ({
  canPrevious,
  canNext,
  firstPage,
  lastPage,
  previousPage,
  nextPage,
  currentPage,
  totalPages,
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
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
}) => {
  let middleButtons: ReactNode = <></>;

  console.log(currentPage);
  console.log("currentPage",currentPage);
  

  if (totalPages && currentPage) {
    const pagesArray = Array.from({ length: totalPages });

    middleButtons = pagesArray.map((page, index) => {
      const displayIndex = index + 1;
      const isActive = (currentPage === (index + 1))
      
      const showButton = currentPage === 1 
      ? [1,2,3] 
      : currentPage === totalPages
        ? [totalPages-2, totalPages-1, totalPages]
        : [currentPage-1, currentPage, currentPage+1]
        
        if (showButton.includes(displayIndex)) {
            return (
                <PaginationItem key={index}>
                    <Button
                      className={
                        "h-6 w-6 border-neutral-400 p-3 hover:bg-neutral-200" + 
                        (isActive ? " bg-neutral-800 text-neutral-50" : "")
                    }
                      variant= "outline"
                      onClick={() =>
                        setPagination &&
                        setPagination((prev) => ({
                          pageIndex: index,
                          pageSize: prev.pageSize,
                        }))
                      }
                    >
                      {displayIndex}
                    </Button>
                </PaginationItem>
              );
        }
      
    });
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            className="h-6 w-6 border-neutral-400 p-3"
            variant="outline"
            onClick={firstPage}
            disabled={!canPrevious}
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
          >
            <TfiAngleDoubleRight size={10} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default TablePagination;
