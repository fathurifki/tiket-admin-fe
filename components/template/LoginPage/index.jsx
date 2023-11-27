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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Axios from "@/lib/api";
import fetchingData from "@/lib/api";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageAssets from "@/components/assets";

const FormSchema = z.object({
  username: z.string().min(1, {
    message: "Required",
  }),
  password: z.string().min(1, {
    message: "Required",
  }),
});

const LoginPage = ({ onLogin }) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    const res = await fetchingData({
      url: "/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      context: {},
    });
    if (res?.status === 200) {
      setCookie("token", res?.data?.tokens?.access_token);
      setCookie("refresh_token_admin", res?.data?.tokens.refresh_token);
      setCookie("role", res?.data?.role);
      // if (res?.data?.tokens?.access_token) {
      router.push("/");
      // }
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }

  return (
    <div className="grid grid-cols w-full h-screen lg:grid lg:grid-cols-2 ">
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:h-full lg:w-full lg:border-r bg-black">
        <p className="font-bold mb-2 lg:block hidden text-white text-3xl">
          Mantra Botol Kreatif
        </p>
      </div>
      <div className="flex flex-col justify-center items-center h-full w-full p-6 space-y-4 block">
        <p className="text-2xl font-bold">Login</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
