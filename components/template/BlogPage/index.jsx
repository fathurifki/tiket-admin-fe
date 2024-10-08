import TableSource from "@/components/atoms/Table";
import TitlePage from "@/components/atoms/TitlePage";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { TanTableCustom } from "@/components/molecules/TanTableCustom";
import { format } from "date-fns";
import { useState } from "react";
import { DialogDemo } from "@/components/atoms/Modal";
import fetchingData from "@/lib/api";

const BlogPageTemplate = ({ ...props }) => {
  const router = useRouter();
  const [state, setState] = useState({
    modal: false,
    idBlog: "",
    data: props?.data?.data || [],
  });

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Slug",
      accessorKey: "slug",
    },
    {
      header: "Author",
      accessorKey: "author",
      cell: ({ row }) => {
        const events = row.original;

        return (
          <div className="relative">
            <span>{events.author.name}</span>
          </div>
        );
      },
    },
    {
      header: "Image",
      accessorKey: "image",
      cell: ({ row }) => {
        const events = row.original;

        return (
          <div className="relative">
            <Image
              alt="image-banner"
              src={events.image}
              width={150}
              height={150}
            />
          </div>
        );
      },
    },
    {
      header: "Created at",
      accessorKey: "published_at",
      cell: ({ row }) => {
        const events = row.original;

        return (
          <div className="relative">
            <span>{format(new Date(events.published_at), "dd MMMM yyyy")}</span>
          </div>
        );
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
                onClick={() =>
                  router.push({
                    pathname: `/blog/edit/${events.slug}/${events.id}`,
                  })
                }
              >
                Edit Blog
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setState({...state, modal: !state.modal, idBlog: events.id })
                }
              >
                Delete Blog
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleRedirect = () => {
    router.push("/blog/create");
  };

  const handleDelete = async () => {
    let req;
    try {
      req = await fetchingData({
        url: `/admin/blog/delete`,
        body: {
          id: state.idBlog,
        },
        method: "DELETE",
      });

      const updatedData = await fetchingData({
        url: `/admin/blog/list?page=${props.data?.page}&per_page=${props?.data?.per_page}`, // Replace with your API endpoint to fetch the data
        method: "GET",
      });
      setState({ ...state, modal: !state.modal, data: updatedData.data });
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="h-full">
      <DialogDemo
        open={state.modal}
        onOpenChange={() => setState({ ...state, modal: !state.modal })}
        onSubmit={handleDelete}
        title="Delete Blog"
      >
        <span>Are you sure want delete selected Blog ?</span>
      </DialogDemo>
      <TitlePage
        title="Blog"
        buttonCreate
        titleButton="Create Blog"
        onClickButton={handleRedirect}
      />
      <div className="mt-6">
        <TanTableCustom
          columns={columns}
          data={state.data || []}
          handlePagePrevious={() => props.handlePageChange(props.data.page - 1)}
          handlePageChange={() => props.handlePageChange(props.data.page + 1)}
          handleSearchValue={(value) => props.handleSearchValue(value)}
          page={props.data?.page}
          totalPages={props?.data?.total_pages}
          filteredBy="title"
          placeholder="Filter Blog"
        />
      </div>
    </div>
  );
};

export default BlogPageTemplate;
