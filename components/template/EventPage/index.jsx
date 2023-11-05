import TableSource from "@/components/atoms/Table";
import TitlePage from "@/components/atoms/TitlePage";
import { useRouter } from "next/router";

const EventsPageTemplate = ({ data }) => {
  const router = useRouter();

  const tableConfig = [
    {
      headerTitle: "#",
      type: "index-number",
    },
    {
      headerTitle: "Event Name",
      key: "event_name",
      type: "string",
    },
    {
      headerTitle: "Slug Name",
      key: "slug_name",
      type: "string",
    },
    {
      headerTitle: "Date",
      key: "date",
      type: "string",
    },
    {
      headerTitle: "Time",
      key: "time",
      type: "string",
    },
    {
      headerTitle: "Location",
      key: "location",
      type: "string",
    },
    {
      headerTitle: "Region",
      key: "region",
      type: "string",
    },
    {
      headerTitle: "Description",
      key: "description",
      type: "string",
    },
    {
      headerTitle: "Event Image",
      key: "event_image",
      type: "string",
    },
    {
      headerTitle: "Event Map",
      key: "event_map",
      type: "string",
    },
    {
      headerTitle: "Type",
      key: "type",
      type: "string",
    },
    {
      headerTitle: "Category Ticket",
      //   key: "category_ticket",
      type: "string",
    },
    {
      headerTitle: "Created At",
      key: "created_at",
      type: "string",
    },
  ];

  const handleRedirect = () => {
    router.push('/events/create')
  }

  return (
    <div className="h-full">
      <TitlePage
        title="Event"
        buttonCreate
        titleButton="Create Event"
        onClickButton={handleRedirect}
      />
      <div className="mt-6">
        <TableSource data={data} tableConfig={tableConfig} />
      </div>
    </div>
  );
};

export default EventsPageTemplate;
