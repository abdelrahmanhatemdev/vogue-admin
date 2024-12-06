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
import { Separator } from "@/components/ui/separator";
import { loginUser } from "@/lib/authService";
import { AdminLoginSchema } from "@/lib/validation/adminAuth/adminLoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
  const form = useForm<z.infer<typeof AdminLoginSchema>>({
    resolver: zodResolver(AdminLoginSchema),
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof AdminLoginSchema>) {
    // e.preventDefault();
    // await loginUser({ email, password });
  }

  return (
    <div className="flex flex-col gap-6 p-32 justify-center">
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
            className="w-full mt-4 p-6 bg-main-800 text-main-50 hover:bg-main-900"
            variant={"nostyle"}
          >
            Login
          </Button>
        </form>
      </Form>
      <div>
        <div className="flex items-center gap-6 w-full">
          <div className="grow">
            <Separator className="bg-main-300" />
          </div>
          <div>Or login with</div>

          <div className="grow">
            <Separator className="bg-main-300" />
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Button
          variant={"outline"}
          className="grow bg-transparent flex gap-2 items-center shadow-sm hover:shadow-none py-5 hover:bg-main-50"
        >
          <FcGoogle
            style={{ width: "1.5rem", height: "1.5rem", display: "block" }}
          />
          <span>Google</span>
        </Button>
        <Button
          variant={"outline"}
          className="grow bg-transparent flex gap-2 items-center shadow-sm hover:shadow-none py-5 hover:bg-main-50"
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
      </div>
    </div>
  );
};
export default Login;
