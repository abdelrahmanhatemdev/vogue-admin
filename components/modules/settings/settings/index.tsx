"use client";
import { memo, useOptimistic } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import { Input } from "@/components/ui/input";

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
        {optimisicData.map((item) =>
          item.isProtected ? (
            <div className="group grid gap-2" key={item.id}>
              <Input defaultValue={item.value} disabled />
              <div className="flex gap-2 text-sm">
                <p className="text-muted-foreground">
                  {item.key} Value
                </p>
                <div className="text-destructive-foreground opacity-0 group-hover:opacity-100 transition-colors">Protected</div>
              </div>
            </div>
          ) : (
            <div key={item.id}>
              <EditSetting item={item} addOptimisticData={addOptimisticData} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default memo(Setting);
