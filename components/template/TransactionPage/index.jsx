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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { format } from "date-fns";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/router";
import { VerifyTicketModal } from "@/components/atoms/VerifyModal";
import { useState } from "react";

const TransactionsPageTemplate = ({ ...props }) => {
  const router = useRouter();
  const [state, setState] = useState({
    modal: false,
    idBanner: "",
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
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => {},
    //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      header: "Transactions Name",
      accessorKey: "user_first_name",
      cell: ({ row }) => {
        const transactions = row.original;
        return (
          <span>
            {transactions?.user_first_name} {transactions?.user_last_name}
          </span>
        );
      },
    },
    {
      header: "Payment Method",
      accessorKey: "payment_method",
    },
    {
      header: "Date",
      accessorKey: "order_date",
      cell: ({ row }) => {
        const transactions = row.original;
        try {
          return (
            <span>
              {format(
                new Date(transactions?.order_date),
                "dd MMMM yyyy, hh:mm a"
              )}
            </span>
          );
        } catch (error) {
          return <span>Invalid date</span>;
        }
      },
    },
    {
      header: "Status",
      accessorKey: "order_status",
    },
    {
      header: "Event",
      accessorKey: "event_name",
    },
    {
      header: "Event Date",
      accessorKey: "event_date",
      cell: ({ row }) => {
        const transactions = row.original;
        try {
          return (
            <span>
              {format(
                new Date(transactions?.event_date),
                "dd MMMM yyyy, hh:mm a"
              )}
            </span>
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
        const transactions = row.original;
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
                    pathname: `/transactions/edit/${transactions.slug}/${transactions.id}`,
                  })
                }
              >
                Transaction Detail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleRedirect = () => {
    router.push("/transactions/create");
  };

  const filterStatus = [
    {
      value: "paid",
      label: "Paid",
    },
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "cancelled",
      label: "Cancelled",
    },
    {
      value: "expired",
      label: "Expired",
    },
  ];

  return (
    <div className="h-full">
      <TitlePage
        buttonCreate
        titleButton="Verify Ticket"
        title="Transactions"
        onClickButton={() => setState({ ...state, modal: true })}
      />
      <VerifyTicketModal
        open={state.modal}
        onOpenChange={(isOpen) => setState({ ...state, modal: isOpen })}
      />
      <div className="mt-6">
        <div className="mt-6">
          <TanTableCustom
            columns={columns}
            data={props?.data?.transactions || []}
            handlePagePrevious={() =>
              props.handlePageChange(props.data.page - 1)
            }
            handlePageChange={() => props.handlePageChange(props.data.page + 1)}
            handleSearchValue={(value) => props.handleSearchValue(value)}
            page={props.data?.page}
            totalPages={props?.data?.total_pages}
            filteredBy="order_status"
            searchFilter={false}
            renderComponent={(table) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Status Payment <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-2">
                  {filterStatus?.map((v) => (
                    <DropdownMenuCheckboxItem
                      key={v.value}
                      checked={
                        table.getColumn('order_status')?.getFilterValue() ===
                        v.value
                      }
                      onCheckedChange={(value) => {
                        if (value) {
                          props.handleSearchValue(v.value);
                          table
                            .getColumn('order_status')
                            ?.setFilterValue(v.value);
                        } else {
                          props.handleSearchValue("");
                          table
                            .getColumn('order_status')
                            ?.setFilterValue("");
                        }
                      }}
                    >
                      {v.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPageTemplate;
