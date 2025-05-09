import { editSubproduct } from "@/actions/Subproduct";
import SwitcherButton from "@/components/custom/table/SwitcherButton";
import { discountPrice } from "@/lib/productService";
import { cn, notify } from "@/lib/utils";
import { memo, useOptimistic, useTransition } from "react";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { RiWaterPercentFill } from "react-icons/ri";

const DetailsSquares = ({
  price,
  discount,
  currency,
  sold,
  qty,
  featured,
  inStock,
  id,
  isProtected,
}: {
  price: number;
  discount: number;
  currency: string;
  sold: number;
  qty: number;
  featured: boolean;
  inStock: boolean;
  id: string;
  isProtected: boolean | undefined;
}) => {
  const [optimisticFeatured, addOptimisticFeatured] = useOptimistic(featured);
  const [optimisticInStock, addOptimisticInStock] = useOptimistic(inStock);
  const [isFeaturedPending, startTransitionFeatured] = useTransition();
  const [isInStockPending, startTransitionInStock] = useTransition();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[calc(50%-.5rem)_calc(50%-.5rem)] gap-4">
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div className="flex flex-col">
          <h4 className="font-extralight">Price</h4>
          <p className="font-bold">
            {discountPrice({ price, discount })}{" "}
            <span className="inline-block font-medium text-xs">{currency}</span>{" "}
          </p>
        </div>
        <div className="flex flex-col justify-center text-xs">
          <div className="flex gap-1 text-green-400  items-center">
            <RiWaterPercentFill size={10} title="Discount" />
            <span>{discount}%</span>
          </div>
          <span className="text-neutral-500 flex gap-1 items-center">
            {" "}
            <span>Price before</span>
            <span className="text-sm line-through">
              {price} {currency}
            </span>
          </span>
        </div>
      </div>
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div className="flex flex-col">
          <h4 className="font-extralight">Orders</h4>
          <p className="font-bold">{sold}</p>
        </div>
        <div className="flex flex-col justify-center text-xs">
          <div className="flex gap-1 text-red-600 items-center">
            <ImArrowDown size={10} />
            <span>1.13%</span>
          </div>
          <span className="text-neutral-500 dark:text-neutral-00">
            Since Last Month
          </span>
        </div>
      </div>
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div className="flex flex-col">
          <h4 className="font-extralight">Quantity</h4>
          <p className="font-bold">{qty}</p>
        </div>
        <div className="flex flex-col justify-center text-xs">
          <div className="flex gap-1 text-green-400  items-center">
            <ImArrowUp size={10} title="Discount" />
            <span>3.73%</span>
          </div>
          <span className="text-neutral-500 dark:text-neutral-00">
            Since Last Month
          </span>
        </div>
      </div>
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div
          className={cn(
            "flex justify-between items-center",
            isFeaturedPending ? "opacity-50" : ""
          )}
        >
          <div className="flex flex-col">
            <span className="font-extralight">Featured</span>
            <span className="text-neutral-500 text-xs">
              <span
                className={`${featured ? "text-green-400" : "text-red-600"}`}
              >
                {" "}
                {featured ? "" : "Not"} Featured
              </span>{" "}
              Product
            </span>
          </div>
          <p className="font-bold">
            <strong>
            <SwitcherButton
                checked={optimisticInStock}
                isProtected={isProtected}
                onCheckedChange={async () => {
                  startTransitionFeatured(() => {
                    addOptimisticFeatured(!optimisticFeatured);
                  });
                  const res: ActionResponse = await editSubproduct({
                    id: id,
                    property: "featured",
                    value: !featured,
                  });

                  notify(res);
                }}
              />
            </strong>
          </p>
        </div>
        <div
          className={cn(
            "flex justify-between items-center",
            isInStockPending ? "opacity-50" : ""
          )}
        >
          <div className="flex flex-col">
            <span className="font-extralight">In stock</span>
            <span className="text-neutral-500 text-xs">
              <span
                className={`${inStock ? "text-green-400" : "text-red-600"}`}
              >
                {" "}
                {inStock ? "" : "Not"} Available{" "}
              </span>{" "}
              in stock
            </span>
          </div>
          <p className="font-bold">
            <strong>
              <SwitcherButton
                checked={optimisticInStock}
                isProtected={isProtected}
                onCheckedChange={async () => {
                  startTransitionInStock(() => {
                    addOptimisticInStock(!optimisticInStock);
                  });

                  const res: ActionResponse = await editSubproduct({
                    id: id,
                    property: "inStock",
                    value: !inStock,
                  });

                  notify(res);
                }}
              />
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};
export default memo(DetailsSquares);
