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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobalNotificationSchema } from "@/lib/validation/settings/GlobalNotificationSchema";
import { z } from "zod";
import { OptimisicDataType } from "@/components/modules/settings/globalNotifications";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { addGlobalNotification } from "@/actions/GlobalNotification";
import { notify } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AddGlobalNotification = ({
  addOptimisticData,
  setIsAddOpen,
}: {
  addOptimisticData: (
    action:
      | GlobalNotification[]
      | ((pendingState: GlobalNotification[]) => GlobalNotification[])
  ) => void;
  setIsAddOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof GlobalNotificationSchema>>({
    resolver: zodResolver(GlobalNotificationSchema),
    defaultValues: {
      uuid: uuidv4(),
      text: "",
      anchorText: "",
      anchorLink: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof GlobalNotificationSchema>) {
    setIsAddOpen(false)
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
      addOptimisticData((prev: GlobalNotification[]) => [
        ...prev,
        optimisticObj,
      ]);
    });
    const res: ActionResponse = await addGlobalNotification(data);
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
          <Button type="submit">Add</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
export default memo(AddGlobalNotification);
