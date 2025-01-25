import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SettingSchema } from "@/lib/validation/settings/SettingSchema";
import { z } from "zod";
import { OptimisicDataType } from "@/components/modules/settings/settings";
import { memo, useTransition } from "react";
import { editSetting } from "@/actions/Setting";
import { notify } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditSetting = ({
  item,
  addOptimisticData,
}: {
  item: Setting;
  addOptimisticData: (
    action: Setting[] | ((pendingState: Setting[]) => Setting[])
  ) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      uuid: item.uuid,
      key: item.key,
      value: item.value,
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof SettingSchema>) {
    const date = new Date().toISOString();
    const data = {
      ...values,
      createdAt: date,
      updatedAt: date,
    };

    const optimisticObj: OptimisicDataType = {
      ...data,
      id: `${data.uuid}`,
      isPending: !isPending,
    };

    startTransition(() => {
      addOptimisticData((prev: Setting[]) => [
        ...prev.filter((i) => i.uuid !== item.uuid),
        optimisticObj,
      ]);
    });
    const res: ActionResponse = await editSetting(data);
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
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{item.key}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{item.key} Value</FormDescription>
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
export default memo(EditSetting);
