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
import { UploadImage } from "@/components/molecules/UploadImage";
import slugify from "slugify";
import { useEffect, useState } from "react";
import CategorySelect from "@/components/molecules/CategorySelect";
import { useToast } from "@/components/ui/use-toast";
import fetchingData from "@/lib/api";
import { useRouter } from "next/router";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  category_id: z.string().uuid({
    message: "Category ID must be a valid UUID.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  image: z.any(),
});

const FormBlog = ({ ...props }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [state, setState] = useState({
    category_id: "",
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      category_id: "",
      slug: "",
      image: null,
    },
  });

  const { setValue, watch, getValues } = form;
  const blogSlug = watch("slug");
  const blogTitle = watch("title");
  const blogCategory = watch("category_id");

  useEffect(() => {
    if (props.isEdit) {
      fetching();
    }
  }, [props.isEdit]);

  useEffect(() => {
    if (!props.isEdit && typeof blogTitle === "string") {
      setValue(
        "slug",
        slugify(blogTitle, {
          lower: true,
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
        })
      );
    } else {
      setValue("slug", blogSlug);
    }
  }, [blogTitle, setValue]);

  async function fetching() {
    const res = await fetchingData({
      url: `/admin/blog/view/${props.slug}`,
    });
    if (res.success) {
      form.reset({
        slug: res?.data.slug,
        title: res?.data.title,
        content: res?.data.content,
        category_id: res?.data.category_id,
        image: res?.data.image,
      });
      setState({ ...state, category_id: res?.data?.category_id });
    }
  }

  async function onSubmit(data) {
    let req;
    try {
      const formData = new FormData();
      const { image, ...rest } = data;
      const payloadEdit = {
        ...rest,
        id: props.id,
      };
      formData.append(
        "payload",
        props.isEdit ? JSON.stringify(payloadEdit) : JSON.stringify(rest)
      );
      formData.append(
        "post_image",
        Array.isArray(image) ? image[0].file : image
      );

      req = await fetchingData({
        url: !props.isEdit ? "/admin/blog/add" : `/admin/blog/edit`,
        body: formData,
        method: props.isEdit ? "PUT" : "POST",
      }).then((res) => {
        router.push("/blog");
        // if (res.status === 200) {
        //   toast({
        //     title: "Success",
        //     description: "Add blog success",
        //     status: "success",
        //     duration: 2000,
        //     isClosable: true,
        //     color: "green",
        //   });
        // }
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
          <TitlePage title={props.isEdit ? "Edit Blog" : "Create Blog"} />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog title" {...field} />
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
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategorySelect
                    value={field?.value || state.category_id}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Image Blog</FormLabel>
                <FormControl>
                  <UploadImage
                    isEdit={props.isEdit}
                    onImageUploadFile={(value) => {
                      field.onChange(value);
                    }}
                    {...field}
                  />
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

export default FormBlog;
