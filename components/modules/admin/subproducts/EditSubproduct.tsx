"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubproductSchema } from "@/lib/validation/subproductSchema";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editSubproduct } from "@/actions/Subproduct";
import { notify } from "@/lib/utils";
import useData from "@/hooks/useData";
import { MultiSelect } from "@/components/ui/multiselect";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { isValidSku } from "@/lib/isValid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/constants/currencies";

function EditSubproduct({
  item,
  setModalOpen,
  addOptimisticData,
  productId,
}: {
  item: Subproduct;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Subproduct[] | ((pendingState: Subproduct[]) => Subproduct[])
  ) => void;
  productId: string;
}) {
  const { data: colors } = useData("colors");
  const { data: sizes } = useData("sizes");

  const form = useForm<z.infer<typeof SubproductSchema>>({
    resolver: zodResolver(SubproductSchema),
    defaultValues: {
      sku: item.sku,
      product_id: productId,
      colors: item.colors as string[],
      sizes: item.sizes as string[],
      price: item.price,
      currency: item.currency,
      discount: item.discount,
      qty: item.qty,
      sold: item.sold,
      featured: item.featured,
      inStock: item.inStock,
    },
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof SubproductSchema>) {
    setModalOpen(false);
    const date = new Date().toISOString();
    const data = {
      productId: productId,
      id: item.id,
      ...values,
      createdAt: item.createdAt,
      updatedAt: date,
    };
    const optimisticObj: Subproduct = {
      ...data,
      isPending: !isPending,
    };

    startTransition(() => {
      addOptimisticData((prev: Subproduct[]) => [
        ...prev.filter((sub) => sub.id !== data.id),
        optimisticObj,
      ]);
    });

    const res: ActionResponse = await editSubproduct(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-2"
      >
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={async (e) => {
                    field.onChange(e.target.value);

                    const checkSku: boolean = await isValidSku({
                      sku: e.target.value,
                      collection: "products",
                      id: item.id,
                    });

                    if (!checkSku) {
                      form.setError("sku", {
                        message: "Sku is already used!",
                      });
                      return;
                    } else {
                      form.clearErrors("sku");
                    }
                  }}
                />
              </FormControl>
              <FormDescription>New Subproduct SKU</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="colors"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <FormLabel>Colors</FormLabel>
              {colors ? (
                <MultiSelect
                  options={colors.map((item) => ({
                    value: item.id,
                    color: item.hex,
                    label:
                      item.name?.length > 5
                        ? item.name.slice(0, 5) + ".."
                        : item.name,
                  }))}
                  onValueChange={field.onChange}
                  placeholder="Select Colors"
                  defaultValue={field.value}
                  asChild
                  className="cursor-pointer"
                />
              ) : (
                <Link href={`/admin/colors`} className="block text-sm">
                  Add some colors to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go to colors
                  </Button>
                </Link>
              )}
              <FormDescription>New subproduct colors</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <FormLabel>Sizes</FormLabel>
              {sizes ? (
                <MultiSelect
                  options={sizes.map((item) => ({
                    value: item.id,
                    label:
                      item.name?.length > 5
                        ? item.name.slice(0, 5) + ".."
                        : item.name,
                  }))}
                  onValueChange={field.onChange}
                  placeholder="Select sizes"
                  defaultValue={field.value}
                  asChild
                  className="cursor-pointer"
                />
              ) : (
                <Link href={`/admin/sizes`} className="block text-sm">
                  Add some sizes to select from{" "}
                  <Button variant={"outline"} size={"sm"}>
                    Go to sizes
                  </Button>
                </Link>
              )}
              <FormDescription>New subproduct sizes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormControl>
          <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
            <FormLabel>Price</FormLabel>
            <div className="flex">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <Input {...field} className="min-w-[60%] rounded-e-none" />
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-[40%] text-xs">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-main-200 rounded-s-none">
                        <SelectValue
                          placeholder="Select Currency"
                          className="truncate"
                        >
                          {field.value}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem
                            value={`${c.code}`}
                            title={`${c.name}`}
                            className="cursor-pointer"
                            key={`${c.code}`}
                          >
                            {`${c.code}  (${c.name})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>New subproduct price</FormDescription>
            <div className="text-[0.8rem] font-medium text-destructive">
              <p>{form.formState?.errors?.price?.message}</p>
              <p>{form.formState?.errors?.currency?.message}</p>
            </div>
          </FormItem>
        </FormControl>
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>discount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New subproduct discount</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qty</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New subproduct qty</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sold</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>New subproduct sold</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <div className="flex justify-between items-center">
                <FormLabel>Featured</FormLabel>
                <FormControl>
                  <Switch
                    {...field}
                    value={`${field.value}`}
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                </FormControl>
              </div>
              <FormDescription>New subproduct is Featured</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inStock"
          render={({ field }) => (
            <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
              <div className="flex justify-between items-center">
                <FormLabel>In Stock</FormLabel>
                <FormControl>
                  <Switch
                    {...field}
                    value={`${field.value}`}
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                </FormControl>
              </div>
              <FormDescription>New subproduct is InStock</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="w-full">
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default memo(EditSubproduct);
