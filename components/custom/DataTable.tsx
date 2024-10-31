"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import DeleteCategory from "../modules/admin/categories/DeleteCategory";
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
  const selectedRows = Object.keys(rowSelection);
  const [showDeleteAll, setShowDeleteAll] = useState(true);
  const [isPending, startTransition] = useTransition();
  

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: (value) => {
      setRowSelection(value)
      setShowDeleteAll(true)
    },
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 500,
    },
    getRowId: (row) => row.id,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
  });

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
        <DialogFooter
          onClick={async () => {
            setOpen(false);
            setShowDeleteAll(false)
            startTransition(() => {
              addOptimisticData((prev: Category[]) => [
                ...prev.map((item) => {
                  if(selectedRows.includes(item.id)){
                    const pendingItem = {...item, isPending: !isPending}
                    return pendingItem
                  }
                  return item
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
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      ),
    });
  }

  const tableHeader = table.getHeaderGroups().map((hgroup) => (
    <TableRow key={hgroup.id}>
      {hgroup.headers.map((header) => (
        <TableHead key={header.id}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
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
    <div>
      {(selectedRows.length > 0 && showDeleteAll)
      ? (
        <Row className="justify-end">
          <Button variant="destructive" onClick={deleteMultiple}>
            Delete Selected
          </Button>
        </Row>
      )
    : ""}
      <Table>
        <TableHeader>{tableHeader}</TableHeader>
        <TableBody>{tableBody}</TableBody>
      </Table>
    </div>
  );
}
