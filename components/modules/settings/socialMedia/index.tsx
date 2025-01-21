"use client";
import {
  memo,
  startTransition,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialMediaSchema } from "@/lib/validation/settings/SocialMediaSchema";
import { z } from "zod";

import { addSocialMedia } from "@/actions/SocialMedia";
import { notify } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { socialMedia as socialMediaList } from "@/constants/socialMedia";

const Heading = dynamic(() => import("@/components/custom/Heading"), {
  loading: Loading,
});
const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);
const Modal = dynamic(() => import("@/components/custom/Modal"), {
  loading: Loading,
});

const AddSocialMedia = dynamic(
  () => import("@/components/modules/settings/socialMedia/AddSocialMedia"),
  {
    loading: Loading,
  }
);

const EditSocialMedia = dynamic(
  () => import("@/components/modules/settings/socialMedia/EditSocialMedia"),
  {
    loading: Loading,
  }
);

const DeleteSocialMedia = dynamic(
  () => import("@/components/modules/settings/socialMedia/DeleteSocialMedia"),
  {
    loading: Loading,
  }
);

import { TbEdit } from "react-icons/tb";
import type { ModalState } from "@/components/custom/Modal";

export type OptimisicDataType = SocialMedia & { isPending?: boolean };

function SocialMedia({ data }: { data: SocialMedia[] }) {
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

  const followersArray = sortedOptimisicData.map((item) => item.followers);
  const totalFollowers = followersArray.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );

  return (
    <div className="flex flex-col rounded-lg bg-background">
      <Collapsible
        open={isAddOpen}
        onOpenChange={(isOpen) => setIsAddOpen(isOpen)}
        className="space-y-2"
      >
        <div className="flex flex-col gap-4">
          <div className="border-b border-neutral-700 pb-4 flex flex-col xs:flex-row justify-between xs:items-center w-full gap-4">
            <div>
              <h2 className="capitalize text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                Social Media
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Manage your social media accounts!
              </p>
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="nostyle"
                size="sm"
                className="flex items-center justify-between space-x-4 dark:hover:bg-neutral-700 hover:bg-neutral-200 p-4 rounded-lg xs:-me-4 xs:-ms-4"
              >
                <h4 className="text-sm font-semibold text-center w-full">Add New</h4>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-2">
            <AddSocialMedia
              addOptimisticData={addOptimisticData}
              setIsAddOpen={setIsAddOpen}
            />
          </CollapsibleContent>
        </div>
      </Collapsible>

      <div className="flex flex-col gap-2 py-4">
        {sortedOptimisicData.map((item) => {
          const social = socialMediaList.find((s) => s.value === item.platform);
          return (
            <Collapsible
              open={openStates[item.uuid] || false} // Default to false if not set
              onOpenChange={(isOpen) => handleOpenChange(item.uuid, isOpen)}
              className="space-y-2"
              key={`${item.uuid}`}
            >
              <div className="flex justify-between items-center">
                <a
                  href={`${item.link}`}
                  target="_blank"
                  className="flex gap-2 items-center dark:hover:bg-neutral-700 hover:bg-neutral-200 w-fit p-2 rounded-lg"
                >
                  <span>{social && <social.icon />}</span>
                  <span className="text-sm">
                    {item.followers ? item.followers + "k" : "No Followers"}
                  </span>
                </a>
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
                        title: `Delete Social Media`,
                        description: (
                          <p className="font-medium">
                            Are you sure To delete the social media permenantly
                            ?
                          </p>
                        ),
                        children: (
                          <DeleteSocialMedia
                            itemId={item.uuid}
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
                <EditSocialMedia
                  item={item}
                  addOptimisticData={addOptimisticData}
                  setOpenStates={setOpenStates}
                />
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      <div className="border-t border-neutral-700 pt-4 flex gap-2 items-center">
        <h5 className="text-neutral-300">Total Followers:</h5>
        <span className="text-xl font-semibold">{totalFollowers}k</span>
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

export default memo(SocialMedia);
