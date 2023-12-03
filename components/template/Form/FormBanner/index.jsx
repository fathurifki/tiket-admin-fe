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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadImage } from "@/components/molecules/UploadImage";
import { useToast } from "@/components/ui/use-toast";
import fetchingData from "@/lib/api";
import { useRouter } from "next/router";

const FormSchema = z.object({
  banner_image: z.any(),
  type: z.enum(["url", "non-url"]),
  value: z
    .string()
    .min(1, "URL is required")
    .refine(
      (value) => /^(ftp|http|https):\/\/[^ "]+$/.test(value),
      "Invalid URL"
    ),
});

const FormBanner = ({ ...props }) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "url",
      banner_image: null,
      value: "",
    },
  });

  async function onSubmit(data) {
    let req;
    try {
      const formData = new FormData();
      const payload = {
        type: data.type,
        value: data.value,
      };
      formData.append("payload", JSON.stringify(payload));
      formData.append("banner_image", data.banner_image[0].file);

      req = await fetchingData({
        url: "/admin/banner/add",
        method: "POST",
        body: formData,
        headers: {
          "Content-type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success submit Banner",
            status: "success",
            duration: 2000,
            isClosable: true,
            description: res?.message,
          });
          router.push("/banner");
        } else {
          toast({
            variant: "destructive",
            title: "Some thing went wrong",
            description: res?.message,
          });
        }
      });
    } catch {}
  }

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <TitlePage title={props.isEdit ? "Edit Banner" : "Create Banner"} />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    className="w-full"
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Url Redirection</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage error={error} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="banner_image"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <UploadImage
                    isEdit={props.isEdit}
                    onImageUploadFile={(value) => {
                      // handleImageUpload("eventMapFile", value);
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

export default FormBanner;
