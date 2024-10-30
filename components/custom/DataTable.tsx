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
import { useState } from "react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

interface RowSelectionType {
  [key: string]: boolean
}

export default function DataTable({
  columns,
  data,
}: DataTableProps<Category>) {
  
  const [rowSelection, setRowSelection] = useState<RowSelectionType>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 200, 
      minSize: 50, 
      maxSize: 500
    }, 
    getRowId: row => row.id,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr"
  });

  console.log("rowSelection", rowSelection);
  

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
      <TableCell colSpan={columns.length} className="w-full flex items-center justify-center">No results.</TableCell>
    </TableRow>
  );

  return (
    <Table>
      <TableHeader>{tableHeader}</TableHeader>
      <TableBody>{tableBody}</TableBody>
    </Table>
  );
}
