"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
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
import { useState, Dispatch, SetStateAction, memo, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ModalState } from "@/components/custom/Modal";
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TiArrowUnsorted } from "react-icons/ti";
import dynamic from "next/dynamic";
import type { ToggleColumnViewProps } from "@/components/custom/ToggleColumnView";
import { DialogFooter } from "@/components/ui/dialog";
import { deleteCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import useCategoryStore from "@/store/useCategoryStore";

const NoResults = dynamic(() => import("@/components/custom/NoResults"));

const ToggleColumnView = dynamic<ToggleColumnViewProps<Category>>(
  () => import("@/components/custom/ToggleColumnView")
);
const TablePagination = dynamic(
  () => import("@/components/custom/TablePagination")
);
const AddCategory = dynamic(
  () => import("@/components/modules/categories/AddCategory")
);

interface CategoryListProps<TData> {
  data: TData[];
  columns: ColumnDef<Category>[];
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalState>>;
}

interface RowSelectionType {
  [key: string]: boolean;
}

function CategoryList({
  data,
  columns,
  setModal,
  setModalOpen,
}: CategoryListProps<Category>) {
  const visibleColumns = useMemo(() => {
    return columns?.length > 0
      ? Object.fromEntries([...columns.map((col) => [col.id, true])])
      : {};
  }, [columns]);

  const [rowSelection, setRowSelection] = useState<RowSelectionType>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(visibleColumns);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const selectedRows = Object.keys(rowSelection);

  const isData = data?.length > 0 ? true : false;

  const {
    fetchData,
    setData,
    nextCursor,
    limit,
    total,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
  } = useCategoryStore();

  const totalRows = total ? total : 0;
  const [showDeleteAll, setShowDeleteAll] = useState(true);

  // Handle pagination changes separately from the table
  const handlePageChange = (newPageIndex:number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize:number) => {
    setPageSize(newPageSize);
  };

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [pageIndex, pageSize, fetchData]);

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
      pagination: { pageIndex, pageSize },
      columnVisibility,
      columnFilters,
    },
    onRowSelectionChange: (value) => {
      setRowSelection(value);
      setShowDeleteAll(true);
    },
    onSortingChange: setSorting,
    manualPagination: true,
    defaultColumn: {
      size: 50,
      minSize: 5,
      maxSize: 500,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.id,
  });

  const currentPage = pageIndex + 1;
  const totalPages = total
    ? Math.ceil(total / pageSize)
    : currentPage + (nextCursor ? 1 : 0);

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

              setData([
                ...data.map((item) => {
                  if (selectedRows.includes(item.id)) {
                    const pendingItem = { ...item, isPending: true };
                    return pendingItem;
                  }
                  return item;
                }),
              ]);

              for (const row of selectedRows) {
                const data = { id: row };
                const res = await deleteCategory(data);
                notify(res);
                if (res?.status === "success") {
                  fetchData();
                }
              }
            }}
          >
            Delete All
          </Button>
        </DialogFooter>
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4 flex-col lg:flex-row flex-wrap">
        <div>
          {isData && (
            <Input
              className="bg-background"
              type="text"
              placeholder="Filter Categories..."
              onChange={(e) =>
                setColumnFilters([{ id: "name", value: e.target.value }])
              }
            />
          )}
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
                children: <AddCategory setModalOpen={setModalOpen} />,
              });
            }}
          >
            Add New
          </Button>

          {isData && (
            <ToggleColumnView
              columns={table.getAllColumns()}
              setColumnVisibility={setColumnVisibility}
              columnVisibility={columnVisibility}
            />
          )}
        </div>
      </div>

      {isData ? (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hgroup) => (
                <TableRow key={hgroup.id}>
                  {hgroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={
                          header.column.getCanSort() ? "cursor-pointer" : ""
                        }
                      >
                        {header.column.getCanSort() ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className="flex gap-2 items-center hover:bg-neutral-200 dark:hover:bg-neutral-500 hover:*:text-neutral-900 dark:text-neutral-50 rounded-lg p-2">
                                <span className="text-neutral-800 dark:text-neutral-300">
                                  {" "}
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </span>
                                <TiArrowUnsorted className="text-neutral-800 dark:text-neutral-500" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-background p-2 rounded-lg *:cursor-pointer">
                              <DropdownMenuItem
                                onClick={() =>
                                  setSorting([
                                    {
                                      desc: false,
                                      id: `${header.column.columnDef.id}`,
                                    },
                                  ])
                                }
                              >
                                <div className="flex items-center gap-2 justify-between">
                                  <span>Asc</span>
                                  <IoIosArrowRoundUp size={20} />
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setSorting([
                                    {
                                      desc: true,
                                      id: `${header.column.columnDef.id}`,
                                    },
                                  ])
                                }
                              >
                                <div className="flex items-center gap-2 justify-between">
                                  <span>Desc</span>
                                  <IoIosArrowRoundDown size={20} />
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setSorting([])}>
                                <div className="flex items-center gap-2 justify-between">
                                  <span>Reset</span>
                                  <IoIosArrowRoundUp size={20} />
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <div>
                            <span className="text-neutral-800 dark:text-neutral-300">
                              {" "}
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </span>
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
                    No results!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex flex-col lg:flex-row lg:items-center items-start lg:justify-between px-2 gap-4">
            <div className="text-neutral-600 dark:text-neutral-300">
              {selectedRows.length > 0
                ? `${selectedRows.length} of ${totalRows} row(s) selected.`
                : `${totalRows} total rows`}
            </div>
            <TablePagination
              canPrevious={pageIndex > 0}
              canNext={currentPage < totalPages}
              firstPage={() => handlePageChange(0)}
              lastPage={() => handlePageChange(totalPages - 1)}
              previousPage={() => handlePageChange(pageIndex - 1)}
              nextPage={() => handlePageChange(pageIndex + 1)}
              currentPage={currentPage}
              totalPages={totalPages}
              pageIndex={pageIndex}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </>
      ) : (
        <NoResults title="Add some Categories to show data!" />
      )}
    </div>
  );
}

export default memo(CategoryList);