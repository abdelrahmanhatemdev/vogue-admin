import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencySchema } from "@/lib/validation/settings/currencySchema";
import { z } from "zod";
import { OptimisicDataType } from "@/components/modules/settings/currencies";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editCurrency } from "@/actions/Currency";
import { notify } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencies as currencyList } from "@/constants/currencies";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditCurrency = ({
  item,
  addOptimisticData,
  setOpenStates,
}: {
  addOptimisticData: (
    action: Currency[] | ((pendingState: Currency[]) => Currency[])
  ) => void;
  item: Currency;
  setOpenStates: Dispatch<SetStateAction<Record<string, boolean>>>;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof currencySchema>>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      uuid: item.uuid,
      code: item.code,
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof currencySchema>) {
    setOpenStates({});
    const date = new Date().toISOString();
    const data = {
      ...values,
      id: item.id,
      createdAt: date,
      updatedAt: date,
    };

    const optimisticObj: OptimisicDataType = {
      ...data,
      id: `${data.uuid}`,
      isPending: !isPending,
    };

    startTransition(() => {
      addOptimisticData((prev: Currency[]) => [
        ...prev.filter((i) => i.uuid !== item.uuid),
        optimisticObj,
      ]);
    });
    const res: ActionResponse = await editCurrency(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Code" />
                </SelectTrigger>
                <SelectContent>
                  {currencyList.map((item) => (
                    <SelectItem value={`${item.code}`} key={item.code}>
                      <span className="w-full flex items-center gap-2">
                        <span>{item.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormDescription>Currency Code</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="flex justify-end w-full">
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
export default memo(EditCurrency);
