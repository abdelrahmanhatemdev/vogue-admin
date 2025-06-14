"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { adminLoginSchema } from "@/lib/validation/auth/adminLoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const router = useRouter();

  const { login } = useAuth();

  async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
    const { email, password } = values;

    const res = await login(email, password);

    if (res.uid) {
      router.push("/")
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 p-12 xl:p-20 justify-center lg:max-w-[30rem] mx-auto">
      <div className="flex flex-col">
        <h1 className="text-[3rem] font-bold">Admin Login</h1>
        <p className="text-sm">Only authorized administrators may log in!</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full mt-4 p-6 bg-neutral-800 text-neutral-50  hover:bg-neutral-950/50 dark:hover:outline cursor-pointer dark:hover:outline-neutral-800"
            variant={"noStyle"}
            type="submit"
          >
            Login
          </Button>
        </form>
      </Form>
      {/* <div>
        <div className="flex items-center gap-6 w-full">
          <div className="grow">
            <Separator className="bg-neutral-300" />
          </div>
          <div>Or login with</div>

          <div className="grow">
            <Separator className="bg-neutral-300" />
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Button
          variant={"outline"}
          className="grow bg-transparent flex gap-2 items-center shadow-sm hover:shadow-none py-5 hover:bg-neutral-50"
        >
          <FcGoogle
            style={{ width: "1.5rem", height: "1.5rem", display: "block" }}
          />
          <span>Google</span>
        </Button>
        <Button
          variant={"outline"}
          className="grow bg-transparent flex gap-2 items-center shadow-sm hover:shadow-none py-5 hover:bg-neutral-50"
        >
          <FaFacebook
            style={{
              width: "1.5rem",
              height: "1.5rem",
              display: "block",
              fill: "#1877F2",
            }}
          />
          <span>Facebook</span>
        </Button>
      </div> */}
    </div>
  );
};
export default memo(Login);