"use client";
import { useState, useMemo, memo, useCallback } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { deleteCategory, getCategories } from "@/actions/Category";
import { notify } from "@/lib/utils";
import usePagination from "@/hooks/usePagination";
import { ModalState } from "@/components/custom/Modal";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AddCategory from "./AddCategory";
import ToggleColumnView from "@/components/custom/ToggleColumnView";
import DataTable from "@/components/custom/table/DataTable";
import Loading from "@/components/custom/Loading";

// Extended Category interface to support optimistic states
interface OptimisticCategory extends Category {
  isOptimistic?: boolean;
  isPending?: boolean;
  isDeleting?: boolean;
  originalData?: Category; // Store original data for rollback
}

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
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(visibleColumns);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showDeleteAll, setShowDeleteAll] = useState(true);
  
  // Local state for optimistic updates
  const [optimisticData, setOptimisticData] = useState<OptimisticCategory[]>([]);

  const selectedRows = Object.keys(rowSelection);

  const {
    items: serverData,
    total,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    mutate, // For manual cache updates
  } = usePagination<Category>({
    tag: "categories",
    getList: getCategories,
    limit: 10,
  });

  // Combine server data with optimistic updates
  const data = useMemo(() => {
    if (!serverData) return optimisticData;
    
    // Start with server data
    let combinedData = [...serverData];
    
    // Apply optimistic updates
    optimisticData.forEach(optimisticItem => {
      if (optimisticItem.isOptimistic) {
        // Add new optimistic items
        combinedData.unshift(optimisticItem);
      } else {
        // Update existing items
        const index = combinedData.findIndex(item => item.id === optimisticItem.id);
        if (index !== -1) {
          combinedData[index] = optimisticItem;
        }
      }
    });
    
    // Filter out items marked for deletion
    combinedData = combinedData.filter(item => !item.isDeleting);
    
    return combinedData;
  }, [serverData, optimisticData]);

  const isData = data?.length > 0;

  // Optimistic add function
  const addOptimisticCategory = useCallback((newCategory: Partial<Category>) => {
    const optimisticCategory: OptimisticCategory = {
      ...newCategory as Category,
      id: `temp-${Date.now()}`, // Temporary ID
      isOptimistic: true,
      isPending: true,
    };
    
    setOptimisticData(prev => [optimisticCategory, ...prev]);
    return optimisticCategory.id;
  }, []);

  // Optimistic update function
  const updateOptimisticCategory = useCallback((id: string, updates: Partial<Category>) => {
    setOptimisticData(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => 
          item.id === id 
            ? { ...item, ...updates, isPending: true, originalData: existing.originalData || item }
            : item
        );
      } else {
        // Item not in optimistic data, add it
        const serverItem = serverData?.find(item => item.id === id);
        if (serverItem) {
          return [...prev, { 
            ...serverItem, 
            ...updates, 
            isPending: true, 
            originalData: serverItem 
          }];
        }
      }
      return prev;
    });
  }, [serverData]);

  // Optimistic delete function
  const deleteOptimisticCategory = useCallback((id: string) => {
    const item = data?.find(item => item.id === id);
    if (item?.isOptimistic) {
      // Remove optimistic items immediately
      setOptimisticData(prev => prev.filter(item => item.id !== id));
    } else {
      // Mark server items as deleting
      setOptimisticData(prev => {
        const existing = prev.find(item => item.id === id);
        if (existing) {
          return prev.map(item => 
            item.id === id ? { ...item, isDeleting: true, isPending: true } : item
          );
        } else {
          const serverItem = serverData?.find(item => item.id === id);
          if (serverItem) {
            return [...prev, { ...serverItem, isDeleting: true, isPending: true }];
          }
        }
        return prev;
      });
    }
  }, [data, serverData]);

  // Confirm optimistic operation
  const confirmOptimisticOperation = useCallback((tempId: string, realData?: Category) => {
    setOptimisticData(prev => {
      if (realData) {
        // Replace temporary item with real data
        return prev.map(item => 
          item.id === tempId 
            ? { ...realData, isPending: false }
            : item
        ).filter(item => item.id !== tempId);
      } else {
        // Just remove pending state
        return prev.map(item => 
          item.id === tempId ? { ...item, isPending: false } : item
        );
      }
    });
  }, []);

  // Rollback optimistic operation
  const rollbackOptimisticOperation = useCallback((id: string) => {
    setOptimisticData(prev => {
      const item = prev.find(item => item.id === id);
      if (item?.isOptimistic) {
        // Remove failed optimistic additions
        return prev.filter(item => item.id !== id);
      } else if (item?.originalData) {
        // Restore original data for failed updates
        return prev.map(item => 
          item.id === id ? item.originalData! : item
        );
      } else {
        // Remove failed operations
        return prev.filter(item => item.id !== id);
      }
    });
  }, []);

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

  function deleteMultiple() {
    setModalOpen(true);
    setModal({
      title: `Delete Categories`,
      description: (
        <p className="font-medium">
          Are you sure to
          {selectedRows.length === 1 ? (
            " delete the category "
          ) : (
            <strong> delete all Categories </strong>
          )}
          permanently ?
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

              // Optimistically delete selected rows
              selectedRows.forEach(id => {
                deleteOptimisticCategory(id);
              });

              // Process deletions
              const failures: string[] = [];
              for (const rowId of selectedRows) {
                try {
                  const res: ActionResponse = await deleteCategory({ id: rowId });
                  notify(res);
                  
                  if (res?.status === "success") {
                    // Remove from optimistic data after successful deletion
                    setOptimisticData(prev => prev.filter(item => item.id !== rowId));
                  } else {
                    failures.push(rowId);
                  }
                } catch (error) {
                  failures.push(rowId);
                  console.error(`Failed to delete category ${rowId}:`, error);
                }
              }

              // Rollback failed deletions
              failures.forEach(id => {
                rollbackOptimisticOperation(id);
              });

              // Refresh data from server
              mutate();
              
              // Reset selection
              setRowSelection({});
              setShowDeleteAll(true);
            }}
          >
            Delete All
          </Button>
        </DialogFooter>
      ),
    });
  }

  // Enhanced add category handler
  const handleAddCategory = useCallback(async (categoryData: Partial<Category>) => {
    // Optimistically add the category
    const tempId = addOptimisticCategory(categoryData);
    
    try {
      // Call your add API here
      // const res: ActionResponse = await addCategory(categoryData);
      
      // For now, simulate API call
      const res = await new Promise<ActionResponse>((resolve) => {
        setTimeout(() => {
          resolve({ 
            status: "success", 
            data: { ...categoryData, id: `real-${Date.now()}` } as Category 
          });
        }, 1000);
      });
      
      notify(res);
      
      if (res?.status === "success" && res.data) {
        confirmOptimisticOperation(tempId, res.data);
        mutate(); // Refresh server data
      } else {
        rollbackOptimisticOperation(tempId);
      }
    } catch (error) {
      rollbackOptimisticOperation(tempId);
      notify({ status: "error", message: "Failed to add category" });
      console.error("Failed to add category:", error);
    }
  }, [addOptimisticCategory, confirmOptimisticOperation, rollbackOptimisticOperation, mutate]);

  // Enhanced update category handler
  const handleUpdateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    // Optimistically update the category
    updateOptimisticCategory(id, updates);
    
    try {
      // Call your update API here
      // const res: ActionResponse = await updateCategory({ id, ...updates });
      
      // For now, simulate API call
      const res = await new Promise<ActionResponse>((resolve) => {
        setTimeout(() => {
          resolve({ 
            status: "success", 
            data: { ...updates, id } as Category 
          });
        }, 1000);
      });
      
      notify(res);
      
      if (res?.status === "success") {
        confirmOptimisticOperation(id, res.data);
        mutate(); // Refresh server data
      } else {
        rollbackOptimisticOperation(id);
      }
    } catch (error) {
      rollbackOptimisticOperation(id);
      notify({ status: "error", message: "Failed to update category" });
      console.error("Failed to update category:", error);
    }
  }, [updateOptimisticCategory, confirmOptimisticOperation, rollbackOptimisticOperation, mutate]);

  if (error) {
    return (
      <div className="flex justify-center p-8">Error: {error.message}</div>
    );
  }

  if (isLoading) {
    return <Loading/>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4 flex-col lg:flex-row flex-wrap">
        <div>
          {isData && (
            <Input
              className="bg-background"
              type="text"
              placeholder="Filter Categories..."
              onChange={(e) =>
                setColumnFilters([{ id: "name", value: e.target.value }])
              }
            />
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
                title: "Add Category",
                description:
                  "Add new Category here. Click Add when you're done.",
                children: <AddCategory 
                  setModalOpen={setModalOpen} 
                  onAddCategory={handleAddCategory}
                />,
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
      <DataTable<OptimisticCategory>
        headers={table.getHeaderGroups()}
        rows={table.getRowModel().rows}
        columnLenght={columns.length}
        onUpdateRow={handleUpdateCategory} // Pass update handler to DataTable
      />
     
      {hasNextPage && (
        <div className="flex justify-center py-2">
          <Button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            variant="outline"
            size={"sm"}
            className="text-xs"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
      <div>Total rows: {total}</div>
    </div>
  );
}

export default memo(CategoryList);