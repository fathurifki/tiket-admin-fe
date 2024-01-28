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
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { UploadImage } from "@/components/molecules/UploadImage";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import slugify from "slugify";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import TimePicker from "@/components/molecules/TimePicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import fetchingData from "../../../../lib/api";
import MyEditor from "@/components/molecules/WYSIWYG";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FormSchema = z.object({
  event_name: z.string().min(1, {
    message: "Username must be at least 2 characters.",
  }),
  slug_name: z.string().min(1, {
    message: "slug must be at least 1",
  }),
  date: z.date(),
  time: z.any(),
  location: z.string(),
  region: z.string().optional(),
  description: z.string(),
  event_image: z.any(),
  event_map: z.any().optional(),
  status: z.string(),
  service_fee_type: z.string(),
  service_fee: z.any(),
});

const FormEvents = ({ ...props }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [state, setState] = useState({
    categoryTicketLength: 0,
    payloadTicket: [],
    eventImageFile: null,
    eventMapFile: null,
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      slug_name: "",
      event_name: "",
      date: "",
      time: "",
      location: "",
      region: "",
      event_image: null, // default value is a new Blob object
      event_map: null, // default value is a new Blob object
      description: "",
      category_ticket: [
        {
          sectionName: "",
          ticketQuota: 0,
          ticketPriceBase: 0,
        },
      ],
      status: "draft",
      service_fee: null,
      service_fee_type: "fixed",
    },
  });

  const { setValue, watch, getValues } = form;
  const eventName = watch("event_name");
  const eventSlug = watch("slug_name");
  const eventMap = watch("event_map");
  const serviceFeeType = watch("service_fee_type");

  useEffect(() => {
    if (props.isEdit) {
      fetching();
    }
  }, [props.isEdit]);

  useEffect(() => {
    if (!props.isEdit && typeof eventName === "string") {
      setValue(
        "slug_name",
        slugify(eventName, {
          lower: true,
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
        })
      );
    } else {
      setValue("slug_name", eventSlug);
    }
  }, [eventName, setValue]);

  const onClickButton = () => {
    const payload = {
      sectionName: "",
      ticketQuota: 0,
      ticketPriceBase: 0,
    };

    setState((prev) => ({
      ...prev,
      payloadTicket: [...prev.payloadTicket, payload],
      categoryTicketLength: prev.categoryTicketLength + 1,
    }));
  };

  const deleteTicketSection = (index) => {
    const temp = [...state.payloadTicket];
    const filteredPayloadTicket = temp.filter((item, i) => i !== index);
    setState((prev) => ({ ...prev, payloadTicket: filteredPayloadTicket }));
  };

  const onInputTicket = (key, value, index) => {
    const temp = [...state.payloadTicket];
    const findIndexTicket = temp.findIndex((item, i) => i === index);
    temp[findIndexTicket] = { ...temp[findIndexTicket], [key]: value };
    setState((prev) => ({ ...prev, payloadTicket: temp }));
  };

  const handleCountQuotaTicket = (type, index) => {
    const temp = [...state.payloadTicket];
    const findIndexTicket = temp.findIndex((item, i) => i === index);
    if (type === "increment") {
      temp[findIndexTicket] = {
        ...temp[findIndexTicket],
        ticketQuota: temp[findIndexTicket].ticketQuota + 1,
      };
    }
    if (type === "decrement") {
      temp[findIndexTicket] = {
        ...temp[findIndexTicket],
        ticketQuota: temp[findIndexTicket].ticketQuota - 1,
      };
    }
    setState((prev) => ({ ...prev, payloadTicket: temp }));
  };

  const handleImageUpload = (key, value) => {
    const imageValue = value?.[0]?.file;
    setState((prev) => ({ ...prev, [key]: imageValue }));
  };

  const formatTimeServer = (date, time) => {
    if (time) {
      const formattedTime = `${date} ${time.hours}:${time.minutes}`;
      const resdate = new Date(formattedTime);

      return resdate.toISOString();
    }
    return null;
  };

  const formatTimePicker = (value) => {
    const { hours, minutes } = value;
    const formatedShowTime = `${hours}:${minutes}`;
    return formatedShowTime;
  };

  async function fetching() {
    const res = await fetchingData({
      url: `/admin/event/view/${props.slug}`,
    });
    if (res?.status === 200) {
      const timeParts = format(new Date(res?.data?.date), "p").split(" ");
      const splitingTime = timeParts[0].split(":");
      const timeObject = {
        hours: splitingTime[0],
        minutes: splitingTime[1],
      };
      form.reset({
        ...res.data,
        slug_name: res?.data?.slug,
        date: new Date(res.data.date),
        time: timeObject,
        event_image: res.data.event_image_url,
        event_map: res?.data?.event_map_url,
      });
      setState((prev) => ({
        ...prev,
        payloadTicket: res?.data?.event_package?.map((v) => ({
          id: v.id,
          sectionName: v.package_type,
          ticketQuota: v.available_tickets,
          ticketPriceBase: v.price,
        })),
      }));
    }
  }

  async function onSubmit(data) {
    let req;
    try {
      const formData = new FormData();

      const payload = {
        ...data,
        date: data?.time
          ? formatTimeServer(format(data?.date, "yyyy-MM-dd"), data?.time)
          : "",
        category_ticket: state.payloadTicket.map((v) => ({
          ...(props.isEdit && { id: v?.id }),
          section_name: v.sectionName,
          avail_qty_ticket: +v.ticketQuota,
          price: +v.ticketPriceBase,
        })),
        service_fee: +data.service_fee,
      };

      const { event_image, event_map, time, ...newPayload } = payload;

      formData.append("payload", JSON.stringify(newPayload));

      if (data?.event_image) {
        formData.append(
          "event_image",
          Array.isArray(data?.event_image)
            ? data?.event_image?.[0]?.file
            : data?.event_image || state.eventImageFile[0].file
        );
      }

      if (data?.event_map) {
        formData.append(
          "event_map",
          Array.isArray(data?.event_map)
            ? data?.event_map?.[0]?.file
            : data?.event_map || state.eventMapFile[0].file
        );
      }

      if (data.service_fee_type === 'fixed' && !Number.isInteger(Number(data.service_fee))) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "Fee must be a fixed price",
        });
        return;
      }
      if (data.service_fee_type === 'percentage' && !data.service_fee.includes('.')) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "Fee must be a percentage",
        });
        return;
      }

      req = await fetchingData({
        url: props.isEdit
          ? `/admin/event/edit_event/${props.id}`
          : "/admin/event/add_event",
        body: formData,
        method: props.isEdit ? "PUT" : "POST",
        headers: {
          "Content-type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.status === 200) {
          toast({
            title: "You submitted the following values:",
            description: res?.message,
          });
          router.push("/events");
        } else {
          toast({
            variant: "destructive",
            title: "You submitted the following values:",
            description: res?.message,
          });
        }
      });
    } catch (error) {
      return false;
    }
  }

  return props.isEdit ? (
    <div className="h-full">
      <Tabs defaultValue="eventDetails">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="eventDetails">Event Details</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
        </TabsList>

        <TabsContent value="eventDetails">
          {newFunction(
            form,
            onSubmit,
            formatTimePicker,
            props,
            handleImageUpload,
            state,
            deleteTicketSection,
            onInputTicket,
            handleCountQuotaTicket,
            onClickButton
          )}
        </TabsContent>

        <TabsContent value="attendees">
          <TitlePage title="Attendee" />
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    newFunction(
      form,
      onSubmit,
      formatTimePicker,
      props,
      handleImageUpload,
      state,
      deleteTicketSection,
      onInputTicket,
      handleCountQuotaTicket,
      onClickButton,
      serviceFeeType
    )
  );
};

export default FormEvents;
function newFunction(
  form,
  onSubmit,
  formatTimePicker,
  props,
  handleImageUpload,
  state,
  deleteTicketSection,
  onInputTicket,
  handleCountQuotaTicket,
  onClickButton,
  serviceFeeType
) {
  return (
    <Form {...form}>
      <TitlePage title={props.isEdit ? "Edit Events" : "Create Events"} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="slug_name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Event Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 w-full ">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Date Event</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field?.value ? (
                            format(field?.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field?.value}
                        onSelect={field.onChange}
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Time Event</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field?.value ? (
                            formatTimePicker(field.value)
                          ) : (
                            <span>Pick a time</span>
                          )}
                          <Clock className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <TimePicker {...field} />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input placeholder="Region" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_image"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Event Image</FormLabel>
              <FormControl>
                <UploadImage
                  isEdit={props.isEdit}
                  onImageUploadFile={(value) => {
                    handleImageUpload("eventImageFile", value);
                    field.onChange(value);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_map"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 my-8">
              <FormLabel>Event Map</FormLabel>
              <FormControl>
                <UploadImage
                  isEdit={props.isEdit}
                  onImageUploadFile={(value) => {
                    handleImageUpload("eventMapFile", value);
                    field.onChange(value);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 w-full ">
          <FormField
            control={form.control}
            name="service_fee_type"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Fee Type</FormLabel>
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
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
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
            name="service_fee"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Fee</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Fee Price"
                    {...field}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (serviceFeeType === "fixed") {
                        value = value.replace(/\./g, ""); // remove any decimal points
                      }
                      if (serviceFeeType === "percentage") {
                        value = value.replace(/[^0-9.]/g, "");
                      }
                      field.onChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category_ticket"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Ticket Package</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {state?.payloadTicket?.map((ticket, i) => (
                  <div
                    className="flex flex-col space-y-4 bg-gray-200 shadow-md p-4 rounded-md w-full"
                    key={i}
                  >
                    <div className="flex justify-between w-full">
                      <Label>Section Name</Label>
                      <Label
                        className="font-bold"
                        onClick={() => deleteTicketSection(i)}
                      >
                        Hapus
                      </Label>
                    </div>
                    <Input
                      value={ticket.sectionName}
                      onChange={(e) =>
                        onInputTicket("sectionName", e.target.value, i)
                      }
                    />
                    <Label>Ticket Price Base</Label>
                    <Input
                      value={ticket.ticketPriceBase}
                      onChange={(e) =>
                        onInputTicket("ticketPriceBase", e.target.value, i)
                      }
                    />
                    <Label>Ticket Quota</Label>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleCountQuotaTicket("decrement", i)}
                      >
                        -
                      </Button>
                      <Input
                        value={ticket.ticketQuota}
                        onChange={(e) =>
                          onInputTicket("ticketQuota", e.target.value, i)
                        }
                      />
                      <Button
                        onClick={() => handleCountQuotaTicket("increment", i)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
                <div
                  onClick={onClickButton}
                  className="flex flex-col space-y-4 bg-gray-200 hover:border-dashed hover:border-2 hover:border-black shadow-md p-4 rounded-md w-full h-[274px] justify-center items-center text-md font-bold "
                >
                  <Plus size={110} />
                  Add More Category Ticket
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <MyEditor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {props.isEdit && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">On Going</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button onClick={onSubmit}>Submit</Button>
      </form>
    </Form>
  );
}
