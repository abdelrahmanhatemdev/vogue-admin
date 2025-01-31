import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GlobalNotificationSchema } from "@/lib/validation/settings/globalNotificationSchema";
import { z } from "zod";
import { OptimisicDataType } from "@/components/modules/settings/globalNotifications";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editGlobalNotification } from "@/actions/GlobalNotification";
import { notify } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditGlobalNotification = ({
  item,
  addOptimisticData,
  setOpenStates
}: {
  addOptimisticData: (
    action: GlobalNotification[] | ((pendingState: GlobalNotification[]) => GlobalNotification[])
  ) => void;
  item: GlobalNotification;
  setOpenStates: Dispatch<SetStateAction<Record<string, boolean>>>;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof GlobalNotificationSchema>>({
    resolver: zodResolver(GlobalNotificationSchema),
    defaultValues: {
      uuid: item.uuid,
      text: item.text,
      anchorText: item.anchorText,
      anchorLink: item.anchorLink,
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof GlobalNotificationSchema>) {
    setOpenStates({})
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
      addOptimisticData((prev: GlobalNotification[]) => [...prev.filter(i => i.uuid !== item.uuid), optimisticObj]);
    });
    const res: ActionResponse = await editGlobalNotification(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 w-full">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Notification Text</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="anchorText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anchor Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Notification anchor text</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="anchorLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anchor Link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Notification anchor link</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="flex justify-end w-full">
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
export default memo(EditGlobalNotification);
