"use client";
import { useState, useMemo, useEffect, memo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { deleteCategory, getCategories } from "@/actions/Category";
import { notify } from "@/lib/utils";
import usePagination from "@/hooks/usePagination";
import { ModalState } from "@/components/custom/Modal";

const NoResults = dynamic(() => import("@/components/custom/NoResults"), { ssr: false });

interface CategoryListProps {
  columns: ColumnDef<Category>[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
}

function CategoryList({ columns, setModal, setModalOpen }: CategoryListProps) {
  const visibleColumns = useMemo(() => {
    return columns?.length > 0
      ? Object.fromEntries(columns.map((col) => [col.id, true]))
      : {};
  }, [columns]);

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(visibleColumns);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { items: data, total, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, error } = usePagination<Category>({
    tag: "categories",
    getList: getCategories,
    limit: 10,
  });

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { rowSelection, sorting, columnVisibility, columnFilters },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.id,
    defaultColumn: { size: 50, minSize: 5, maxSize: 500 },
    manualPagination: true,
  });

  const handleLoadMore = () => {
  if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Render content based on state
  if (error) {
    return <div className="flex justify-center p-8">Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading categories...</div>;
  }

  console.log("data length", data.length === total);
  

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hgroup) => (
            <TableRow key={hgroup.id}>
              {hgroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
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
              <TableCell colSpan={columns.length}>No results!</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {( hasNextPage || (data.length === total)) && (
        <div className="flex justify-center py-4">
          <Button onClick={handleLoadMore} disabled={isFetchingNextPage} variant="outline">
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      ) }
      <div>Total rows: {total}</div>
    </div>
  );
}

export default memo(CategoryList);