import { Checkbox } from "@/components/ui/checkbox";
import { Table } from "@tanstack/react-table";

type SelectAllCheckboxProps<T> = {
  table: Table<T>;
};

function SelectAllCheckbox<T>({ table }: SelectAllCheckboxProps<T>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected()
          ? true
          : table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : false
      }
      onCheckedChange={(value) =>
        table.toggleAllPageRowsSelected(value === true)
      }
      aria-label="Select all"
    />
  );
}

export default SelectAllCheckbox;
