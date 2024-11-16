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
import { deleteProduct } from "@/actions/Product";
import { notify } from "@/lib/utils";
import { PiPlusCircle } from "react-icons/pi";
import useData from "@/hooks/useData";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

const ToggleColumnView = dynamic<ToggleColumnViewProps<Product>>(
  () => import("@/components/custom/ToggleColumnView"),
  { loading: Loading }
);
const TablePagination = dynamic(
  () => import("@/components/custom/TablePagination"),
  { loading: Loading }
);
const AddProduct = dynamic(() => import("./AddProduct"), {
  loading: Loading,
});

interface ProductListProps<TData> {
  data: TData[];
  columns: ColumnDef<Product>[];
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalState>>;
  addOptimisticData: (
    action: Product[] | ((pendingState: Product[]) => Product[])
  ) => void;
}

interface RowSelectionType {
  [key: string]: boolean;
}

function ProductList({
  data,
  columns,
  setModal,
  setModalOpen,
  addOptimisticData,
}: ProductListProps<Product>) {
  const { data: categories } = useData("categories");
  const { data: brands } = useData("brands");

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
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(visibleColumns);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const selectedRows = Object.keys(rowSelection);

  const isData = data?.length > 0 ? true : false;

  const totalRows = data?.length ? data.length : 0;
  const [showDeleteAll, setShowDeleteAll] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

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
    getRowId: (row) => row.id,
  });

  const currentPage = pagination.pageIndex + 1;
  const totalPages =
    data.length > 0 ? Math.ceil(data.length / pagination.pageSize) : 1;

  function deleteMultiple() {
    setModalOpen(true);
    setModal({
      title: `Delete Products`,
      description: (
        <p className="font-medium">
          Are you sure to
          {selectedRows.length === 1 ? (
            " delete the Product "
          ) : (
            <strong> delete all products </strong>
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
                addOptimisticData((prev: Product[]) => [
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
                const res: ActionResponse = await deleteProduct(data);
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
        <div className="flex gap-2 items-center">
          {isData && (
            <Input
              className="bg-background"
              type="text"
              placeholder="Filter Products..."
              onChange={(e) =>
                setColumnFilters((prevFilters) => {
                  const newFilters = prevFilters.filter(
                    (filter) => filter.id !== "name"
                  );
                  return [
                    ...newFilters,
                    {
                      id: "name",
                      value: e.target.value,
                    },
                  ];
                })
              }
            />
          )}
          {/* {isData && categories.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="border-dashed border-main-300 border-2 font-bold"
                >
                  <PiPlusCircle size={30} />
                  Categories
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2" asChild>
                <div className="flex flex-col gap-2 ">
                  {categories.map((item) => (
                    <Button
                      variant={"ghost"}
                      className="w-full flex gap-2 justify-start items-center"
                      onClick={() => {
                        setColumnFilters([
                          { id: "categories", value: item.id },
                        ]);
                      }}
                      key={item.id}
                    >
                      <Checkbox />
                      <span>{item.name}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )} */}
          {isData && brands.length > 0 && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="border-dashed border-main-300 border-2"
                  >
                    <div className="flex items-center justify-center gap-1 font-bold">
                      <PiPlusCircle size={30} />
                      <span>Brands</span>
                    </div>
                    {selectedBrands.length > 0 && (
                      <>
                        <Separator orientation="vertical" />
                        {selectedBrands.map((id) => (
                          <span
                            key={id}
                            className="bg-main-200 p-1 rounded-md text-xs"
                          >
                            {brands.find((b) => b.id === id)?.name}
                          </span>
                        ))}
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <div className="flex flex-col gap-2 ">
                    {brands.map((item) => (
                      <Button
                       className="w-full flex gap-2 justify-start items-center cursor-pointer"
                        variant={"ghost"}
                        key={item.id}
                        onClick={() =>
                          setSelectedBrands((prev) => {
                            const updatedBrandFilter = prev.includes(item.id)
                              ? prev.filter((b) => b !== item.id)
                              : [...prev, item.id];

                            setColumnFilters((prevFilters) => {
                              const newFilters = prevFilters.filter(
                                (filter) => filter.id !== "brand"
                              );
                              return [
                                ...newFilters,
                                {
                                  id: "brand",
                                  value: updatedBrandFilter,
                                },
                              ];
                            });
                            return updatedBrandFilter;
                          })
                        }
                        asChild
                      >
                        <div>
                          <Checkbox
                            checked={selectedBrands.includes(item.id)}
                          />
                          <span>{item.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
          {selectedBrands.length > 0 && (
            <Button
              variant={"ghost"}
              onClick={() => {
                setSelectedBrands(() => {
                  const updatedBrandFilter: string[] = [];

                  setColumnFilters((prevFilters) => {
                    const newFilters = prevFilters.filter(
                      (filter) => filter.id !== "brand"
                    );
                    return [...newFilters];
                  });
                  return updatedBrandFilter;
                });
              }}
              className="flex gap-1 rounded-md p-2 font-bold"
            >
              <span> Reset</span>
              <X />
            </Button>
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
                title: "Add Product",
                description:
                  "Add new product here. Click Add when you'are done.",
                children: (
                  <AddProduct
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
              columnVisibility={columnVisibility}
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
                              <div className="flex gap-2 items-center hover:bg-main-200 hover:*:text-main-900 rounded-lg p-2">
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
          </div>
        </>
      ) : (
        <NoResults title="Add some products to show data!" />
      )}
    </div>
  );
}

export default memo(ProductList);
