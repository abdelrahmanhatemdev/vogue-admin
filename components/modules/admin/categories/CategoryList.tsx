"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  PaginationState,
  SortingState,
  VisibilityState,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useState, Dispatch, SetStateAction, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Row from "@/components/custom/Row";
import { deleteCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import { ModalState } from "@/components/custom/Modal";
import {
  LiaSortAmountUpAltSolid,
  LiaSortAmountDownSolid,
} from "react-icons/lia";

import { DialogFooter } from "@/components/ui/dialog";
import TablePagination from "@/components/custom/TablePagination";
import AddCategory from "./AddCategory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CiSliderHorizontal } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";
import { Value } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";

interface CategoryListProps<TData> {
  data: TData[];
  columns: ColumnDef<Category>[];
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalState>>;
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
}

interface RowSelectionType {
  [key: string]: boolean;
}

export default function CategoryList({
  data,
  columns,
  setModal,
  setModalOpen,
  addOptimisticData,
}: CategoryListProps<Category>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionType>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    select: true,
    name: true,
    actions: true,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const selectedRows = Object.keys(rowSelection);
  const totalRows = data?.length ? data.length : 0;
  const [showDeleteAll, setShowDeleteAll] = useState(true);
  const [isPending, startTransition] = useTransition();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      sorting,
      pagination,
      columnVisibility,
      columnFilters,
    },
    onRowSelectionChange: (value) => {
      setRowSelection(value);
      setShowDeleteAll(true);
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 500,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
  });

  const currentPage = pagination.pageIndex + 1;
  const totalPages =
    data.length > 0 ? Math.ceil(data.length / pagination.pageSize) : 1;

  function deleteMultiple() {
    setModalOpen(true);
    setModal({
      title: `Delete Categories`,
      description: (
        <p className="font-medium">
          Are you sure to
          {selectedRows.length === 1 ? (
            " delete the category "
          ) : (
            <strong> delete all categories </strong>
          )}
          permenantly ?
        </p>
      ),
      children: (
        <DialogFooter>
          <Button
            type="submit"
            variant="destructive"
            onClick={async () => {
              setModalOpen(false);
              setShowDeleteAll(false);
              startTransition(() => {
                addOptimisticData((prev: Category[]) => [
                  ...prev.map((item) => {
                    if (selectedRows.includes(item.id)) {
                      const pendingItem = { ...item, isPending: !isPending };
                      return pendingItem;
                    }
                    return item;
                  }),
                ]);
              });
              for (const row of selectedRows) {
                const data = { id: row };
                const res: ActionResponse = await deleteCategory(data);
                notify(res);
              }
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      ),
    });
  }

  const tableHeader = table.getHeaderGroups().map((hgroup) => (
    <TableRow key={hgroup.id}>
      {hgroup.headers.map((header) => (
        <TableHead
          key={header.id}
          className={
            header.column.getCanSort() ? "cursor-pointer select-none" : ""
          }
          onClick={header.column.getToggleSortingHandler()}
          title={
            header.column.getCanSort()
              ? header.column.getNextSortingOrder() === "asc"
                ? "Sort ascending"
                : header.column.getNextSortingOrder() === "desc"
                ? "Sort descending"
                : "Clear sort"
              : ""
          }
        >
          <Row className="items-center gap-2">
            <div className="hover:text-neutral-950">
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </div>
            <div>
              {header.column.getCanSort() ? (
                header.column.getNextSortingOrder() === "asc" ? (
                  ""
                ) : header.column.getNextSortingOrder() === "desc" ? (
                  <LiaSortAmountUpAltSolid size={20} />
                ) : (
                  <LiaSortAmountDownSolid size={20} />
                )
              ) : (
                ""
              )}
            </div>
          </Row>
        </TableHead>
      ))}
    </TableRow>
  ));

  const tableBody = table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        className="w-full flex items-center justify-center"
      >
        No results.
      </TableCell>
    </TableRow>
  );

  console.log("Filter", table.getState().columnFilters);

  return (
    <div className="flex flex-col gap-4">
      <Row className="justify-between gap-2">
        <div>
          <Input
            type="text"
            placeholder="Filter Categories..."
            onChange={(e) =>
              setColumnFilters([{ id: "name", value: e.target.value }])
            }
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          {selectedRows.length > 0 && showDeleteAll && (
            <Button variant="destructive" onClick={deleteMultiple} size="sm">
              Delete Selected
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              setModalOpen(true);
              setModal({
                title: "Add Category",
                description:
                  "Add new Category here. Click Add when you'are done.",
                children: (
                  <AddCategory
                    setModalOpen={setModalOpen}
                    addOptimisticData={addOptimisticData}
                  />
                ),
              });
            }}
          >
            Add New
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <CiSliderHorizontal />
                <span>View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {table.getAllColumns()?.length > 0
                  ? table.getAllColumns().map((col) => (
                      <DropdownMenuItem
                        className="capitalize"
                        key={col.id}
                        onClick={() =>
                          setColumnVisibility((prev) => ({
                            ...prev,
                            [col.id]: !prev[col.id],
                          }))
                        }
                      >
                        <div className="flex justify-center items-center gap-4">
                          <span className="w-3">
                            {columnVisibility[col.id] === true ? (
                              <IoCheckmark />
                            ) : (
                              ""
                            )}
                          </span>
                          <span>{col.id}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  : ""}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Row>

      <Table>
        <TableHeader>{tableHeader}</TableHeader>
        <TableBody>{tableBody}</TableBody>
      </Table>
      <Row className="items-center justify-between px-2">
        <div className="text-neutral-600">
          {selectedRows.length} of {totalRows} row(s) selected.
        </div>
        <TablePagination
          canPrevious={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
          firstPage={() => table.firstPage()}
          lastPage={() => table.lastPage()}
          previousPage={() => table.previousPage()}
          nextPage={() => table.nextPage()}
          currentPage={currentPage}
          totalPages={totalPages}
          pagination={pagination}
          setPagination={setPagination}
        />
      </Row>
    </div>
  );
}
