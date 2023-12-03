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
import { TanTableCustom } from "@/components/molecules/TanTableCustom";
import { format } from "date-fns";
import { useState } from "react";
import { DialogDemo } from "@/components/atoms/Modal";
import fetchingData from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BlogCategoryTemplate = ({ ...props }) => {
  const router = useRouter();
  const [state, setState] = useState({
    type: "CREATED",
    modal: false,
    idCategory: "",
    categoryValue: "",
    data: props?.data || [],
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
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Created at",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const events = row.original;

        return (
          <div>
            <span>{format(new Date(events.created_at), "dd MMMM yyyy")}</span>
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
                  setState({
                    ...state,
                    modal: !state.modal,
                    type: "EDIT",
                    categoryValue: events.name,
                    idCategory: events.id,
                  })
                }
              >
                Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setState({
                    ...state,
                    type: "DELETE",
                    modal: !state.modal,
                    idCategory: events.id,
                  })
                }
              >
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleUpdateData = async () => {
    let req;
    try {
      let urlReq;
      let method;

      if (state.type === "CREATED") {
        urlReq = `/admin/blog/category/add`;
        method = "POST";
      } else if (state.type === "EDIT") {
        urlReq = `/admin/blog/category/edit`;
        method = "PUT";
      } else {
        urlReq = `/admin/blog/category/delete/${state.idCategory}`;
        method = "DELETE";
      }

      const payloadEdit = {
        id: state.idCategory,
        name: state.categoryValue,
      };

      const payloadCreated = {
        category_name: state.categoryValue,
      };

      req = await fetchingData({
        url: urlReq,
        body:
          state.type === "EDIT"
            ? payloadEdit
            : state.type === "CREATED"
            ? payloadCreated
            : undefined,
        method: method,
      });

      const updatedData = await fetchingData({
        url: `/admin/blog/category/list?page=${props.data?.page}&per_page=${props?.data?.per_page}`, // Replace with your API endpoint to fetch the data
        method: "GET",
      });
      setState({ ...state, modal: !state.modal, data: updatedData });
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="h-full">
      <DialogDemo
        open={state.modal}
        onOpenChange={() => setState({ ...state, modal: !state.modal })}
        onSubmit={handleUpdateData}
        title={
          state.type === "EDIT"
            ? "Edit Category"
            : state.type === "CREATED"
            ? "Create Category"
            : "Delete Category"
        }
      >
        {state.type === "DELETE" ? (
          <>
            <span>Are you sure want to delete selected Cateogry ?</span>
          </>
        ) : (
          <>
            <Label>Category</Label>
            <Input
              value={state.categoryValue}
              onChange={(e) =>
                setState({
                  ...state,
                  categoryValue: e.target.value,
                })
              }
            />
          </>
        )}
      </DialogDemo>
      <TitlePage
        title="Blog Category"
        buttonCreate
        titleButton="Create Blog Category"
        onClickButton={() => setState({ ...state, modal: !state.modal })}
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
          placeholder="Filter Blog Category"
          searchFilter={false}
        />
      </div>
    </div>
  );
};

export default BlogCategoryTemplate;
