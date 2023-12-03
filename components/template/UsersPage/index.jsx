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
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/router";

function UsersPageTemplate({ ...props }) {
  const router = useRouter();

  const tableConfig = [
    {
      headerTitle: "#",
      type: "index-number",
    },
    {
      headerTitle: "Username",
      key: "username",
      type: "string",
    },
    {
      headerTitle: "Email",
      key: "email",
      type: "string",
    },
    {
      headerTitle: "Last Login",
      key: "last_login",
      type: "string",
    },
  ];

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
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => {},
    //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "last_login",
      header: "Last Login",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      //   cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];

  const handleRedirect = () => {
    router.push("/users/create");
  };

  return (
    <div className="h-full">
      <TitlePage
        title="Users"
        buttonCreate
        titleButton="Create User"
        onClickButton={handleRedirect}
      />
      <div className="mt-6">
        {/* <DataTable data={data.users} columns={columns}/> */}
        <TanTableCustom
          columns={columns}
          data={props?.data?.users || []}
          handlePagePrevious={() => props.handlePageChange(props.page - 1)}
          handlePageChange={() => props.handlePageChange(props.page + 1)}
          handleSearchValue={(value) => props.handleSearchValue(value)}
          page={props?.data?.page}
          totalPages={props?.data?.total_pages}
          filteredBy="username"
          placeholder="Filter Username"
        />
        {/* <TableSource data={data?.users} tableConfig={tableConfig} /> */}
      </div>
    </div>
  );
}

export default UsersPageTemplate;
