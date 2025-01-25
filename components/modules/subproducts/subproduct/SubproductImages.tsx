"use client";
import { cn, notify } from "@/lib/utils";
import {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
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
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const uploadsPath = `${process.env.NEXT_PUBLIC_APP_UPLOADS}/images`;

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
}: {
  setModal: Dispatch<SetStateAction<ModalState>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  uuid: string;
}) => {
  const [imageList, setImageList] = useState<OptimisicImagesType[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const [optimisticImages, addOptimisticImages] =
    useOptimistic<OptimisicImagesType[]>(imageList);

  const {
    data: fetchedImages,
    error,
    isLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_APP_API}/images/productImages/${uuid}`,
    fetcher
  );

  useEffect(() => {
    if (!isLoading && fetchedImages) {
      setImageList(fetchedImages);
    }
  }, [fetchedImages, isLoading]);

  if (isLoading) return;

  async function handleSort(updatedList: OptimisicImagesType[]) {
    // startTransition(() => {
    //   addOptimisticImages(imageList);
    // });
    // setImageList(updatedList);

    const list: string[] = updatedList.map((image) => image.id);
    const res = await editProductImage(list);
    notify(res);
  }

  async function deleteImage(id: string) {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticImages((prev: ProductImage[]) => [
        ...prev.filter((item) => item.id !== id),
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

  console.log("images", imageList);

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
      {imageList.length > 0 ? (
        <ReactSortable
          list={imageList}
          setList={setImageList}
          animation="200"
          easing="ease-out"
          className="flex flex-wrap items-center justify-start gap-4"
          onEnd={({ oldIndex, newIndex }) => {
            if (oldIndex === newIndex) return;
            const updatedList = [...imageList];
            const [movedItem] = updatedList.splice(oldIndex, 1);
            updatedList.splice(newIndex, 0, movedItem);
            handleSort(updatedList);
          }}
        >
          {optimisticImages.map((image, index) => {
            const { id, src, isPending } = image;
            const path = `${uploadsPath}/${uuid}/${src}`;

            return (
              <div
                className="w-full lg:h-32 lg:w-auto relative rounded-md overflow-hidden"
                key={index}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    children: (
                      <div>
                        <PhotoViewer
                          setModalOpen={setModalOpen}
                          src = {`/api/images/src/${path}`}
                        />
                      </div>
                    ),
                    className:
                      "bg-transparent border-none lg:py-14  bg-[hsl(0,0%,0%,0.5)]",
                    onPointerDownOutsideClose: true,
                  });
                }}
              >
                {path && (
                  <>
                    {/* <Image
                      key={id}
                      src={isPending ? path : `/api/images/src/${path}`}
                      alt={`Subproduct photo-${id}`}
                      className={cn(
                        "w-full lg:w-auto lg:h-32 rounded-md",
                        isPending ? "opacity-50" : ""
                      )}
                      height={100}
                      width={200}
                      priority
                    /> */}
                    <img
                      key={id}
                      src={isPending ? path : "/api/images/src/" + path}
                      alt={`Subproduct photo-${id} `}
                      className={cn(
                        "w-full lg:w-auto lg:h-32 rounded-md",
                        isPending ? "opacity-50" : ""
                      )}
                      height={100}
                      width={200}
                    />
                  </>
                )}
                <div className="group absolute inset-0 z-10 transition-colors bg-opacity-10 bg-black hover:bg-opacity-80 flex flex-col items-center justify-center text-sm w-full h-full cursor-grab">
                  <X
                    className="absolute end-2 top-2 text-gray-300 hover:text-gray-50 transition-colors text-[.5rem] cursor-pointer"
                    size={15}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(id);
                    }}
                  />
                  <Checkbox
                    className="absolute inset-2 cursor-pointer border-neutral-100"
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
