import DataTable from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];

export default async function CategoriesList({ data }: { data: Category[] }) {
  return (
    <>
      <div>Categories List</div>
      <DataTable data={data} columns={columns}/>
    </>
  );
}
