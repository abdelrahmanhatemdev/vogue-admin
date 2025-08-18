import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Row, HeaderGroup } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { memo } from "react";

interface DataTableOptions<T> {
  headers: HeaderGroup<T>[];
  rows: Row<T>[];
  columnLenght: number;
}

const DataTable = <T,>({
  headers,
  rows,
  columnLenght,
}: DataTableOptions<T>) => {
  return (
    <Table>
      <TableHeader>
        {headers.map((hgroup) => (
          <TableRow key={hgroup.id}>
            {hgroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows?.length ? (
          rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnLenght}>No results!</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default memo(DataTable) as typeof DataTable;
