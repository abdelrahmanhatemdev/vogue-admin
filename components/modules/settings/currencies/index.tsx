"use client";
import { memo, useMemo, useOptimistic, useState } from "react";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { TbTrashOff } from "react-icons/tb";
import { Trash2Icon } from "lucide-react";
import { currencies as currencyList } from "@/constants/currencies";

const Modal = dynamic(() => import("@/components/custom/Modal"), {
  loading: Loading,
});

const AddCurrency = dynamic(
  () => import("@/components/modules/settings/currencies/AddCurrency"),
  {
    loading: Loading,
  }
);

const EditCurrency = dynamic(
  () => import("@/components/modules/settings/currencies/EditCurrency"),
  {
    loading: Loading,
  }
);

const DeleteCurrency = dynamic(
  () => import("@/components/modules/settings/currencies/DeleteCurrency"),
  {
    loading: Loading,
  }
);

import { TbEdit } from "react-icons/tb";
import type { ModalState } from "@/components/custom/Modal";
const NoResults = dynamic(() => import("@/components/custom/NoResults"), {
  loading: Loading,
});

const DeleteButton = dynamic(() => import("@/components/custom/table/DeleteButton"), {
  loading: Loading,
});

const EditButton = dynamic(() => import("@/components/custom/table/EditButton"), {
  loading: Loading,
});

export type OptimisicDataType = Currency & { isPending?: boolean };

function Currency({ data }: { data: Currency[] }) {
  const [optimisicData, addOptimisticData] = useOptimistic(data);

  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOpenChange = (uuid: string, isOpen: boolean) => {
    setOpenStates((prev) => ({ ...prev, [uuid]: isOpen }));
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const sortedOptimisicData = useMemo(() => {
    return optimisicData?.length
      ? optimisicData.sort((a: OptimisicDataType, b: OptimisicDataType) =>
          b.updatedAt.localeCompare(a.updatedAt)
        )
      : [];
  }, [optimisicData]);

  return (
    <div className="flex flex-col rounded-lg bg-background">
      <Collapsible
        open={isAddOpen}
        onOpenChange={(isOpen) => setIsAddOpen(isOpen)}
        className="space-y-2"
      >
        <div className="flex flex-col gap-4">
          <div className="border-b border-neutral-700 pb-4 flex flex-col sm:flex-row justify-between sm:items-center w-full gap-4">
            <div>
              <h2 className="capitalize text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                currency
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Manage your currency details!
              </p>
            </div>
            <div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="noStyle"
                  size="sm"
                  className="dark:hover:bg-neutral-700 hover:bg-neutral-200 p-4 rounded-lg xs:-me-4 xs:-ms-4 text-sm font-semibold text-center"
                >
                  Add New
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="space-y-2">
            <AddCurrency
              addOptimisticData={addOptimisticData}
              setIsAddOpen={setIsAddOpen}
            />
          </CollapsibleContent>
        </div>
      </Collapsible>

      <div className="flex flex-col gap-2 py-4">
        {sortedOptimisicData.length > 0 ? (
          sortedOptimisicData.map((item) => {
            const curruncy = currencyList.find((s) => s.code === item.code);
            return (
              <Collapsible
                open={openStates[item.uuid] || false} // Default to false if not set
                onOpenChange={(isOpen) => handleOpenChange(item.uuid, isOpen)}
                className="space-y-2"
                key={`${item.uuid}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="dark:bg-neutral-700 bg-neutral-200 w-fit p-2 rounded-lg text-sm">
                    {curruncy?.name}
                  </h3>

                  <div className="flex items-center gap-2 justify-end">
                    <CollapsibleTrigger>
                      <TbEdit size={20} className="cursor-pointer" />
                    </CollapsibleTrigger>

                    <Trash2Icon
                      size={20}
                      color="#dc2626"
                      className="cursor-pointer"
                      onClick={() => {
                        setModalOpen(true);
                        setModal({
                          title: `Delete Currency`,
                          description: (
                            <p className="font-medium">
                              Are you sure To delete the currency permenantly ?
                            </p>
                          ),
                          children: (
                            <DeleteCurrency
                              itemId={item.id}
                              setModalOpen={setModalOpen}
                              addOptimisticData={addOptimisticData}
                            />
                          ),
                        });
                      }}
                    />
                  </div>
                </div>
                <CollapsibleContent>
                  <EditCurrency
                    item={item}
                    addOptimisticData={addOptimisticData}
                    setOpenStates={setOpenStates}
                  />
                </CollapsibleContent>
              </Collapsible>
            );
          })
        ) : (
          <NoResults title="Add some Currencies to show data!" />
        )}
      </div>

      <Modal
        title={modal.title}
        description={modal.description}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        className={modal.className}
        onPointerDownOutsideClose={modal.onPointerDownOutsideClose}
      >
        <>{modal.children}</>
      </Modal>
    </div>
  );
}

export default memo(Currency);
