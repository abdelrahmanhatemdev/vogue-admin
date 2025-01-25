"use client";
import { memo, useOptimistic } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";

const EditSetting = dynamic(
  () => import("@/components/modules/settings/settings/EditSetting"),
  {
    loading: Loading,
  }
);

export type OptimisicDataType = Setting & { isPending?: boolean };

function Setting({ data }: { data: Setting[] }) {
  const [optimisicData, addOptimisticData] = useOptimistic(data);

  return (
    <div className="flex flex-col rounded-lg bg-background">
      <div className="flex flex-col gap-4">
        <div className="border-b border-neutral-700 pb-4 flex flex-col xs:flex-row justify-between xs:items-center w-full gap-4">
          <div>
            <h2 className="capitalize text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              Settings
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Manage your Settings details!
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        {optimisicData.map((item) => (
          <div key={item.uuid}>
            <EditSetting item={item} addOptimisticData={addOptimisticData} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Setting);
