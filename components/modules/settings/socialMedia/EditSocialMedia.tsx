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
import { socialMediaSchema } from "@/lib/validation/settings/socialMediaSchema";
import { z } from "zod";
import { OptimisicDataType } from "@/components/modules/settings/socialMedia";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editSocialMedia } from "@/actions/SocialMedia";
import { notify } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialMedia as socialMediaList } from "@/constants/socialMedia";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditSocialMedia = ({
  item,
  addOptimisticData,
  setOpenStates
}: {
  addOptimisticData: (
    action: SocialMedia[] | ((pendingState: SocialMedia[]) => SocialMedia[])
  ) => void;
  item: SocialMedia;
  setOpenStates: Dispatch<SetStateAction<Record<string, boolean>>>;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      uuid: item.uuid,
      link: item.link,
      platform: item.platform as "instagram",
      followers: item.followers,
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof socialMediaSchema>) {
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
      id: `${data.id}`,
      isPending: !isPending,
    };

    startTransition(() => {
      addOptimisticData((prev: SocialMedia[]) => [...prev.filter(i => i.id !== item.id), optimisticObj]);
    });
    const res: ActionResponse = await editSocialMedia(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <div className="grid grid-cols-[calc(40%-2rem/3)_calc(30%-2rem/3)_calc(30%-2rem/3)] gap-4 w-full">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Social Media Link</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialMediaList.map((platform) => (
                      <SelectItem
                        value={`${platform.value}`}
                        key={platform.value}
                      >
                        <span className="w-full flex items-center gap-2">
                          <platform.icon />
                          <span>{platform.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Social Media Platform</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="followers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Followers</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Followers in k</FormDescription>
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
export default memo(EditSocialMedia);
