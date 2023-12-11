import TableSource from "@/components/atoms/Table";
import { TanTableCustom } from "@/components/molecules/TanTableCustom";
import TitlePage from "@/components/atoms/TitlePage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/router";

const EventsPageTemplate = ({ ...props }) => {
  const router = useRouter();

  const columns = EventColumn();

  const handleRedirect = () => {
    router.push("/events/create");
  };

  return (
    <div className="h-full">
      <TitlePage
        title="Event"
        buttonCreate
        titleButton="Create Event"
        onClickButton={handleRedirect}
      />
      <div className="mt-6">
        <div className="mt-6">
          <TanTableCustom
            columns={columns}
            data={props?.data?.events || []}
            handlePagePrevious={() =>
              props.handlePageChange(props.data.page - 1)
            }
            handlePageChange={() => props.handlePageChange(props.data.page + 1)}
            handleSearchValue={(value) => props.handleSearchValue(value)}
            page={props.data?.page}
            totalPages={props?.data?.total_pages}
            filteredBy="name"
            placeholder="Filter Event"
          />
        </div>
      </div>
    </div>
  );

  function EventColumn() {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all" />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]" />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      // {
      //   accessorKey: "id",
      //   header: ({ column }) => {},
      //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
      //   enableSorting: false,
      //   enableHiding: false,
      // },
      {
        header: "Event Name",
        accessorKey: "name",
      },
      {
        header: "Slug Name",
        accessorKey: "slug",
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => {
          const events = row.original;
          try {
            return <span>{format(new Date(events?.date), "dd MMMM yyyy")}</span>;
          } catch (error) {
            return <span>Invalid date</span>;
          }
        },
      },
      {
        header: "Location",
        accessorKey: "location",
      },
      {
        header: "Status",
        accessorKey: "status",
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ row }) => {
          const events = row.original;
          try {
            return (
              <span>{format(new Date(events?.created_at), "dd MMMM yyyy")}</span>
            );
          } catch (error) {
            return <span>Invalid date</span>;
          }
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const events = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push({
                    pathname: `/events/edit/${events.slug}/${events.id}`,
                  })}
                >
                  Edit Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }
};

export default EventsPageTemplate;
