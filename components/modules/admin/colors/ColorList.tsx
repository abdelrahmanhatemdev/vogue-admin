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
import {
  useState,
  Dispatch,
  SetStateAction,
  useTransition,
  memo,
  useMemo,
} from "react";
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
import Loading from "@/components/custom/Loading";
import NoResults from "@/components/custom/NoResults";
import { ToggleColumnViewProps } from "@/components/custom/ToggleColumnView";
import { DialogFooter } from "@/components/ui/dialog";
import { deleteColor } from "@/actions/Color";
import { notify } from "@/lib/utils";

const ToggleColumnView = dynamic<ToggleColumnViewProps<Color>>(
  () => import("@/components/custom/ToggleColumnView"),
  { loading: Loading }
);
const TablePagination = dynamic(
  () => import("@/components/custom/TablePagination"),
  { loading: Loading }
);
const AddColor = dynamic(() => import("@/components/modules/admin/colors/AddColor"), { loading: Loading });

interface ColorListProps<TData> {
  data: TData[];
  columns: ColumnDef<Color>[];
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalState>>;
  addOptimisticData: (
    action: Color[] | ((pendingState: Color[]) => Color[])
  ) => void;
}

interface RowSelectionType {
  [key: string]: boolean;
}

function ColorList({
  data,
  columns,
  setModal,
  setModalOpen,
  addOptimisticData,
}: ColorListProps<Color>) {
  const visibleColumns = useMemo(() => {
    return columns?.length > 0
      ? Object.fromEntries([...columns.map((col) => [col.id, true])])
      : {};
  }, [columns]);

  const [rowSelection, setRowSelection] = useState<RowSelectionType>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(visibleColumns);

  const selectedRows = Object.keys(rowSelection);

  const isData = data?.length > 0 ? true : false;

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
      size: 50,
      minSize: 5,
      maxSize: 500,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.uuid,
  });

  const currentPage = pagination.pageIndex + 1;
  const totalPages =
    data.length > 0 ? Math.ceil(data.length / pagination.pageSize) : 1;

    function deleteMultiple() {
      setModalOpen(true);
      setModal({
        title: `Delete Colors`,
        description: (
          <p className="font-medium">
            Are you sure to
            {selectedRows.length === 1 ? (
              " delete the color "
            ) : (
              <strong> delete all colors </strong>
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
                  addOptimisticData((prev: Color[]) => [
                    ...prev.map((item) => {
                      if (selectedRows.includes(item.uuid)) {
                        const pendingItem = { ...item, isPending: !isPending };
                        return pendingItem;
                      }
                      return item;
                    }),
                  ]);
                });
                for (const row of selectedRows) {
                  const data = { uuid: row };
                  const res: ActionResponse = await deleteColor(data);
                  notify(res);
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
              placeholder="Filter Colors..."
              onChange={(e) =>
                setColumnFilters([{ id: "name", value: e.target.value }])
              }
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          {selectedRows.length > 0 && showDeleteAll && (
            <Button
              variant="destructive"
              onClick={deleteMultiple}
              size="sm"
            >
              Delete Selected
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              setModalOpen(true);
              setModal({
                title: "Add Color",
                description: "Add new Color here. Click Add when you'are done.",
                children: (
                  <AddColor
                    setModalOpen={setModalOpen}
                    addOptimisticData={addOptimisticData}
                  />
                ),
              });
            }}
          >
            Add New
          </Button>

          {isData && (
            <ToggleColumnView
              columns={table.getAllColumns()}
              setColumnVisibility={setColumnVisibility}
              columnVisibility= {columnVisibility}
            />
          )}
        </div>
      </div>

      {isData ? (
        <>
          <Table className="border rounded-xl">
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
                              <div className="flex gap-2 items-center hover:bg-main-200 hover:*:text-main-900 rounded-lg p-2 -ms-2">
                                <span className="text-main-800">
                                  {" "}
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </span>
                                <TiArrowUnsorted
                                  style={{ fill: "var(--main-800)" }}
                                />
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
                            <span className="text-main-800">
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
            <div className="text-neutral-600">
              {selectedRows.length > 0
                ? `${selectedRows.length} of ${totalRows} row(s) selected.`
                : `${totalRows} total rows`}
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
          </div>
        </>
      ) : (
        <NoResults title="Add some Colors to show data!" />
      )}
    </div>
  );
}

export default memo(ColorList);
