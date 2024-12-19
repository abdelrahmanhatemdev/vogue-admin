import { Dispatch, memo, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { CiSliderHorizontal } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";

import { Column, VisibilityState } from "@tanstack/react-table";

export interface ToggleColumnViewProps<Type> {
  columns: Column<Type, unknown>[];
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
  columnVisibility: VisibilityState;
}

function ToggleColumnView<Type>({
  columns,
  setColumnVisibility,
  columnVisibility,
}: ToggleColumnViewProps<Type>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label = {`Toggle Columns`}>
          <CiSliderHorizontal />
          <span>View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {columns?.length > 0
            ? columns.map((col) => {
                if (col?.id) {
                  return (
                    <DropdownMenuItem
                      className="capitalize"
                      key={col.id}
                      onClick={() =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [col.id]: !prev[col.id],
                        }))
                      }
                    >
                      <div className="flex justify-center items-center gap-4">
                        <span className="w-3">
                          {columnVisibility[col.id] === true ? (
                            <IoCheckmark />
                          ) : (
                            ""
                          )}
                        </span>
                        <span>{col.id}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                }
              })
            : ""}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default memo(ToggleColumnView) as typeof ToggleColumnView;
