"use client";
import { cn, notify } from "@/lib/utils";
import {
  Dispatch,
  memo,
  SetStateAction,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { ReactSortable } from "react-sortablejs";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import { OptimisicImagesType } from "@/components/modules/subproducts/Subproduct";
import { Button } from "@/components/ui/button";
import type { ModalState } from "@/components/custom/Modal";
import { DialogFooter } from "@/components/ui/dialog";
import { deleteProductImage, editProductImage } from "@/actions/Image";
import { Trash2Icon, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import Image from "next/image";

const Heading = dynamic(() => import("@/components/custom/Heading"), {
  loading: Loading,
});

const AddSubproductPhotos = dynamic(
  () =>
    import("@/components/modules/subproducts/subproduct/AddSubproductPhotos"),
  {
    loading: Loading,
  }
);

const PhotoViewer = dynamic(
  () => import("@/components/modules/subproducts/subproduct/PhotoViewer"),
  { loading: Loading }
);

const SubproductImages = ({
  setModal,
  setModalOpen,
  uuid,
  images,
}: {
  setModal: Dispatch<SetStateAction<ModalState>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  uuid: string;
  images: ProductImage[];
}) => {
  const [imageList, setImageList] = useState<OptimisicImagesType[]>(images);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const [optimisticImages, addOptimisticImages] =
    useOptimistic<OptimisicImagesType[]>(imageList);

  async function handleSort(updatedList: OptimisicImagesType[]) {
    startTransition(() => {
      addOptimisticImages(updatedList);
    });
    // setImageList(updatedList);

    const list: string[] = updatedList.map((image) => image.id);
    const res = await editProductImage(list);
    notify(res);
  }

  async function deleteImage(id: string) {
    setModalOpen(false);

    startTransition(() => {
      addOptimisticImages((prev: ProductImage[]) => [
        ...prev.map((item) => {
          if (item.id === id) {
            const pendingItem = { ...item, isPending: !isPending };
            return pendingItem;
          }
          return item;
        }),
      ]);
    });
    const res = await deleteProductImage({ id });
    notify(res);
  }

  function deleteMultipleImages() {
    setModalOpen(true);
    setModal({
      title: `Delete images`,
      description: (
        <p className="font-medium">
          Are you sure to
          {selectedImages.length === 1 ? (
            " delete the image "
          ) : (
            <strong> delete all images </strong>
          )}
          permenantly ?
        </p>
      ),
      children: (
        <DialogFooter>
          <Button
            type="submit"
            variant="destructive"
            onClick={async () => {
              setModalOpen(false);
              startTransition(() => {
                addOptimisticImages((prev: OptimisicImagesType[]) => [
                  ...prev.filter((item) => !selectedImages.includes(item.id)),
                ]);
              });
              for (const selected of selectedImages) {
                const data = { id: selected };
                const res: ActionResponse = await deleteProductImage(data);
                notify(res);
              }
              setSelectedImages([]);
            }}
          >
            Delete {selectedImages.length > 1 && "All"}
          </Button>
        </DialogFooter>
      ),
    });
  }

  return (
    <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
      <div className="flex justify-between items-center">
        <Heading
          title={`Photos`}
          description="Here's list of your subproduct photos!"
        />
        <div className="flex items-center gap-2 justify-end">
          {selectedImages.length > 0 ? (
            <Button
              variant={"destructive"}
              size={"sm"}
              className="flex items-center gap-2 group"
              onClick={deleteMultipleImages}
            >
              <span>Delete Selected</span>
              <Trash2Icon size={20} className="cursor-pointer" />
            </Button>
          ) : (
            <></>
          )}
          <Button
            size="sm"
            onClick={() => {
              setModalOpen(true);
              setModal({
                title: "Add photos",
                description:
                  "Add new photos here. Click Add when you'are done.",
                children: (
                  <AddSubproductPhotos
                    setModalOpen={setModalOpen}
                    addOptimisticData={addOptimisticImages}
                    subproductId={uuid}
                  />
                ),
              });
            }}
          >
            Add New
          </Button>
        </div>
      </div>
      {optimisticImages.length > 0 ? (
        <ReactSortable
          list={optimisticImages}
          setList={setImageList}
          animation="200"
          easing="ease-out"
          className="flex flex-wrap items-center justify-start gap-4"
          onEnd={({ oldIndex, newIndex }) => {
            if (oldIndex === newIndex) return;
            const updatedList = [...optimisticImages];
            const [movedItem] = updatedList.splice(oldIndex, 1);
            updatedList.splice(newIndex, 0, movedItem);
            handleSort(updatedList);
          }}
        >
          {optimisticImages.map((image, index) => {
            const { id, isPending, url } = image;

            return (
              <div
                className="w-full sm:h-32 sm:w-auto relative rounded-md overflow-hidden"
                key={index}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    children: (
                      <div>
                        <PhotoViewer
                          setModalOpen={setModalOpen}
                          src={`${url}`}
                        />
                      </div>
                    ),
                    className:
                      "bg-transparent border-none lg:py-14  bg-[hsl(0,0%,0%,0.5)]",
                    onPointerDownOutsideClose: true,
                  });
                }}
              >
                {url && (
                  <>
                    <Image
                      key={id}
                      src={isPending ? url : `${url}`}
                      alt={`Subproduct photo-${id} `}
                      className={cn(
                        "w-full sm:w-auto sm:h-32 rounded-md",
                        isPending ? "opacity-50" : ""
                      )}
                      height={100}
                      width={200}
                    />
                  </>
                )}
                <div className="group absolute inset-0 z-10 transition-colors bg-opacity-10 bg-black hover:bg-opacity-80 flex flex-col items-center justify-center text-sm w-full h-full cursor-grab">
                  <X
                    className="absolute end-2 top-2 text-neutral-300 hover:text-neutral-800 dark:text-neutral-950 dark:hover:text-neutral-400 transition-colors text-[.5rem] cursor-pointer"
                    size={15}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(id);
                    }}
                  />
                  <Checkbox
                    className="absolute inset-2 cursor-pointer border-neutral-100 dark:border-neutral-950 hover:border-neutral-950 dark:hover:border-neutral-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={(value) =>
                      setSelectedImages((prev) =>
                        value
                          ? [...prev, id]
                          : [...prev.filter((selected) => selected !== id)]
                      )
                    }
                    checked={selectedImages.includes(id)}
                  />
                </div>
              </div>
            );
          })}
        </ReactSortable>
      ) : null}
    </div>
  );
};
export default memo(SubproductImages);
