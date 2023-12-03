"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TableSource from "@/components/atoms/Table";
import TitlePage from "@/components/atoms/TitlePage";
import { Button } from "@/components/ui/button";
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
import MyEditor from "@/components/molecules/WYSIWYG";
import { useEffect } from "react";
import slugify from "slugify";
import { useToast } from "@/components/ui/use-toast";
import fetchingData from "@/lib/api";
import { useRouter } from "next/router";

const FormSchema = z.object({
  slug: z
    .string()
    .min(2, {
      message: "Slug must be at least 2 characters.",
    })
    .max(50, {
      message: "Slug must be less than 50 characters.",
    }),
  page_title: z
    .string()
    .min(2, {
      message: "Page title must be at least 2 characters.",
    })
    .max(100, {
      message: "Page title must be less than 100 characters.",
    }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
});

const FormStaticPage = ({ ...props }) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      slug: "",
      page_title: "",
      content: "",
    },
  });

  const { setValue, watch, getValues } = form;
  const eventSlug = watch("slug");
  const eventTitle = watch("page_title");

  useEffect(() => {
    fetching();
  }, []);

  useEffect(() => {
    if (!props.isEdit && typeof eventTitle === "string") {
      setValue(
        "slug",
        slugify(eventTitle, {
          lower: true,
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
        })
      );
    } else {
      setValue("slug", eventSlug);
    }
  }, [eventTitle, setValue]);

  async function fetching() {
    const res = await fetchingData({
      url: `/admin/page/view/${props.id}`,
    });
    form.reset({
      slug: res?.slug,
      page_title: res?.title,
      content: res?.content,
    });
  }

  async function onSubmit(data) {
    let req;
    try {
      const payloadEdit = {
        ...data,
        id: props.id,
      };
      req = await fetchingData({
        url: !props.isEdit ? "/admin/page/add" : `/admin/page/edit`,
        body: !props.isEdit ? data : payloadEdit,
        method: !props.isEdit ? "POST" : "PUT",
      }).then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: "Add Page success",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          router.push("/static-page");
        }
      });
    } catch (error) {
      return error
    }
  }

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <TitlePage
            title={props.isEdit ? "Edit Static Page" : "Create Static Page"}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="page_title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Page Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <MyEditor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default FormStaticPage;
