"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../ui/table";
import { useState, Dispatch, SetStateAction, useTransition } from "react";
import { Button } from "../ui/button";
import Row from "./Row";
import { deleteCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import { ModalProps } from "./Modal";
import {
  LiaSortAmountUpAltSolid,
  LiaSortAmountDownSolid,
} from "react-icons/lia";
import {
  TfiAngleDoubleLeft,
  TfiAngleDoubleRight,
  TfiAngleLeft,
  TfiAngleRight,
} from "react-icons/tfi";

import { DialogFooter } from "../ui/dialog";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalProps>>;
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
}

interface RowSelectionType {
  [key: string]: boolean;
}

export default function DataTable({
  columns,
  data,
  setOpen,
  setModal,
  addOptimisticData,
}: DataTableProps<Category>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionType>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
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
    state: {
      rowSelection,
      sorting,
      pagination,
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
    getRowId: (row) => row.id,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
  });

  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  function deleteMultiple() {
    setOpen(true);
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
              setOpen(false);
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

  return (
    <div className="flex flex-col gap-4">
      {selectedRows.length > 0 && showDeleteAll ? (
        <Row className="justify-end">
          <Button variant="destructive" onClick={deleteMultiple}>
            Delete Selected
          </Button>
        </Row>
      ) : (
        ""
      )}
      <Table>
        <TableHeader>{tableHeader}</TableHeader>
        <TableBody>{tableBody}</TableBody>
      </Table>
      <Row className="items-center justify-between">
        <div>
          {selectedRows.length} of {totalRows} row(s) selected.
        </div>
        <div className="flex items-center justify-end gap-4">
          <div>
            <div className="font-semibold text-sm text-neutral-700">
              Rows Per Page
            </div>
          </div>
          <div className="font-semibold text-sm text-neutral-700">
            Page {pagination.pageIndex} of {pagination.pageSize}
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={() => table.firstPage()}
              disabled={!canPrevious}
            >
              <TfiAngleDoubleLeft size={10} />
            </Button>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!canPrevious}
            >
              <TfiAngleLeft size={10} />
            </Button>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!canNext}
            >
              <TfiAngleRight size={10} />
            </Button>
            <Button
              className="h-6 w-6 border-neutral-400 p-3"
              variant="outline"
              onClick={() => table.lastPage()}
              disabled={!canNext}
            >
              <TfiAngleDoubleRight size={10} />
            </Button>
          </div>
        </div>
      </Row>
    </div>
  );
}
