"use client";
import { memo, useMemo, useOptimistic, useState, useTransition } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import useData from "@/hooks/useData";
import { discountPrice } from "@/lib/productService";
import { Switch } from "@/components/ui/switch";
import { editSubproduct } from "@/actions/Subproduct";
import { cn, notify } from "@/lib/utils";
import { arrayFromString } from "@/lib/format";
import { TbEdit } from "react-icons/tb";
import { Trash2Icon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ReactSortable } from "react-sortablejs";
import { deleteProductImage, editProductImage } from "@/actions/Image";
import { DialogFooter } from "@/components/ui/dialog";

const Link = dynamic(() => import("next/link"), { loading: Loading });
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
const EditSubproduct = dynamic(
  () => import("@/components/modules/admin/subproducts/EditSubproduct"),
  {
    loading: Loading,
  }
);
const DeleteSubproduct = dynamic(
  () => import("@/components/modules/admin/subproducts/DeleteSubproduct"),
  {
    loading: Loading,
  }
);
const AddSubproductPhotos = dynamic(
  () => import("@/components/modules/admin/subproducts/AddSubproductPhotos"),
  {
    loading: Loading,
  }
);
const PhotoSlider = dynamic(
  () => import("@/components/modules/admin/subproducts/PhotoSlider"),
  { loading: Loading }
);

type SubproductPageType = Subproduct & {
  product_slug: string;
  product_name: string;
  product_id: string;
};

export type OptimisicImagesType = ProductImage & { isPending?: boolean };

function Subproduct({
  subproduct,
  images,
}: {
  subproduct: SubproductPageType;
  images: ProductImage[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });
  const [imageList, setImageList] = useState<OptimisicImagesType[]>(images);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const [optimisticImages, addOptimisticImages] =
    useOptimistic<OptimisicImagesType[]>(images);

  const {
    uuid,
    sku,
    currency,
    price,
    discount,
    qty,
    sold,
    featured,
    inStock,
    colors: item_colors,
    sizes: item_sizes,
    product_name: productName,
    product_slug,
    product_id,
  } = subproduct;

  const [productSlug, setProductSlug] = useState(product_slug);

  const { data: colors } = useData("colors");
  const { data: sizes } = useData("sizes");

  const itemColors: string[] = Array.from(
    new Set(arrayFromString(item_colors as string))
  );
  const itemSizes: string[] = Array.from(
    new Set(arrayFromString(item_sizes as string))
  );

  const router = useRouter();

  async function handleSort(list: string[]) {
    const res = await editProductImage(list);
    notify(res);
  }

  async function handleRemove(id: string) {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticImages((prev: ProductImage[]) => [
        ...prev.map((item) => {
          if (item.id === id) {
            return { ...item, isPending: !isPending };
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
                  ...prev.map((item) => {
                    if (selectedImages.includes(item.id)) {
                      const pendingItem = { ...item, isPending: !isPending };
                      return pendingItem;
                    }
                    return item;
                  }),
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
            Delete All
          </Button>
        </DialogFooter>
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb
        page={`${sku}`}
        between={[
          {
            link: `/admin/products`,
            title: `Products`,
          },
          {
            link: `/admin/products/${productSlug}`,
            title: `${productName}`,
          },
        ]}
      />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading
            title={`${sku}`}
            description="Here's details of your subproduct!"
          />
          <div className="flex items-center gap-2 justify-end">
            <Button
              size={"sm"}
              className="flex items-center gap-2 group"
              onClick={() => {
                setModalOpen(true);
                setModal({
                  title: `Edit Sub Product`,
                  description:
                    "Update Sub Product here. Click Update when you'are done.",
                  children: (
                    <EditSubproduct
                      item={subproduct}
                      setModalOpen={setModalOpen}
                      productId={product_id}
                    />
                  ),
                });
              }}
            >
              <span>Edit</span>
              <TbEdit size={20} className="cursor-pointer" />
            </Button>
            <Button
              variant={"destructive"}
              size={"sm"}
              className="flex items-center gap-2 group"
              onClick={() => {
                setModalOpen(true);
                setModal({
                  title: `Delete Sub Product`,
                  description: (
                    <p className="font-medium">
                      Are you sure To delete the Sub Product permenantly ?
                    </p>
                  ),
                  children: (
                    <DeleteSubproduct
                      itemId={uuid}
                      setModalOpen={setModalOpen}
                      redirect={true}
                      productSlug={productSlug}
                    />
                  ),
                });
              }}
            >
              <span>Delete</span>
              <Trash2Icon size={20} className="cursor-pointer" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 *:bg-background *:p-2 *:rounded-md">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span className="text-main-700">Price</span>
              <strong>{price}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-main-700">Currency</span>

              <strong>{currency}</strong>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span className="text-main-700">Discount</span>
              <strong>{discount}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-main-700">Net Price</span>

              <strong>
                {discountPrice({ price, discount })} {currency}
              </strong>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span className="text-main-700">Quantity</span>
              <strong>{qty}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-main-700">Sold</span>

              <strong>{sold}</strong>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span className="text-main-700">Featured</span>
              <strong>
                <Switch
                  checked={featured}
                  onCheckedChange={async () => {
                    const { featured, ...rest } = subproduct;

                    const res: ActionResponse = await editSubproduct({
                      uuid: uuid,
                      property: "featured",
                      value: !featured,
                    });

                    notify(res);
                  }}
                />
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-main-700">In Stock</span>
              <strong>
                <Switch
                  checked={inStock}
                  onCheckedChange={async () => {
                    const { inStock, ...rest } = subproduct;

                    const res: ActionResponse = await editSubproduct({
                      uuid,
                      property: "inStock",
                      value: !inStock,
                    });

                    notify(res);
                  }}
                />
              </strong>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 *:bg-background *:p-2 *:rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-main-700">Colors</span>

              <span className="flex gap-2">
                {colors.length > 0 ? (
                  itemColors.map((color: string) => {
                    const itemColor = colors.find((c) => c.uuid === color);
                    return itemColor ? (
                      <div
                        className="flex gap-2 p-1 bg-main-100 rounded-md items-center border border-main-200"
                        key={itemColor.uuid}
                      >
                        <span
                          className={`h-4 w-4 rounded-sm block ring-ring ring-1`}
                          style={{
                            backgroundColor: itemColor?.hex,
                          }}
                        ></span>
                        <span className="text-sm text-main-800">
                          {itemColor?.name}
                        </span>
                      </div>
                    ) : (
                      <></>
                    );
                  })
                ) : (
                  <></>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-main-700">Sizes</span>

              <span className="flex gap-2">
                {sizes.length > 0 ? (
                  itemSizes.map((size: string) => {
                    const itemSize = sizes.find((s) => s.uuid === size);

                    return itemSize ? (
                      <div
                        className="flex gap-2 p-1 bg-main-100 rounded-md items-center border border-main-200"
                        key={itemSize.uuid}
                      >
                        <span className="text-sm text-main-800">
                          {itemSize?.name}
                        </span>
                      </div>
                    ) : (
                      <></>
                    );
                  })
                ) : (
                  <></>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
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
                setImageList(updatedList);
                handleSort(updatedList.map((image) => image.id));
              }}
            >
              {optimisticImages.map((image) => {
                const { id, src, isPending } = image;
                return (
                  <div
                    className="w-full lg:h-32 lg:w-auto relative rounded-md overflow-hidden"
                    key={src}
                    onClick={() => {
                      setModalOpen(true);
                      setModal({
                        children: (
                          <PhotoSlider
                            setModalOpen={setModalOpen}
                            images={optimisticImages}
                          />
                        ),
                        className: "lg:min-w-[80vw] bg-transparent border-none",
                        onPointerDownOutsideClose: true,
                      });
                    }}
                  >
                    <Image
                      key={id}
                      src={isPending ? src : `/api/images/src${src}`}
                      alt={`Subproduct photo ${sku}-${id} `}
                      className={cn(
                        "w-full lg:w-auto lg:h-32 rounded-md",
                        isPending ? "opacity-50" : ""
                      )}
                      height={100}
                      width={200}
                    />
                    <div className="group absolute inset-0 z-10 transition-colors bg-opacity-10 bg-black hover:bg-opacity-80 flex flex-col items-center justify-center text-sm w-full h-full cursor-grab">
                      <X
                        className="absolute end-2 top-2 text-gray-300 hover:text-gray-50 transition-colors text-[.5rem] cursor-pointer"
                        size={15}
                        onClick={() => handleRemove(id)}
                      />
                      <Checkbox
                        className="absolute inset-2 cursor-pointer border-main-100"
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
          ) : (
            <></>
          )}
        </div>
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

export default memo(Subproduct);
