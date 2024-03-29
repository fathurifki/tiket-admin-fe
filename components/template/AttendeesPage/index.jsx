"use client";

import TitlePage from "@/components/atoms/TitlePage";
import { TanTableCustom } from "@/components/molecules/TanTableCustom";
import fetchingData from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/useDebounce";


const AttendeesPage = ({ ...props }) => {
  const [state, setState] = useState({
    data: [],
    page: 1,
    name: "",
  });
  const debounce = useDebounce(state.name, 500);

  useEffect(() => {
    fetching();
  }, [props.id, state.page, debounce]);


  async function fetching() {
    const params = {
      name: debounce,
      page: state.page,
      per_page: 10,
    }
    const urlParams = new URLSearchParams(params).toString();
    const res = await fetchingData({
      url: `/admin/event/user/${props.id}?${urlParams}`,
    });
    if (res?.status === 200) {
      setState((prev) => ({
        ...prev,
        data: res?.data.users,
        page: res?.data.page,
        per_page: res?.data.per_page,
        success: res?.data.success,
        total: res?.data.total,
        total_pages: res?.data.total_pages,
      }));
    }
  }

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
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "occupation",
      header: "Occupation",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "cloth_size",
      header: "Cloth Size",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
  ];

  return (
    <div>
      <TitlePage title="Attendees" />
      <TanTableCustom
        columns={columns}
        data={state?.data || []}
        handlePagePrevious={() =>
          setState((prev) => ({ ...prev, page: prev.page - 1 }))
        }
        handlePageChange={() =>
          setState((prev) => ({ ...prev, page: prev.page + 1 }))
        }
        handleSearchValue={(e) => setState((prev) => ({ ...prev, name: e }))}
        page={state?.page}
        totalPages={state?.total_pages}
        filteredBy="username"
        placeholder="Filter Username"
      />
    </div>
  );
};

export default AttendeesPage;
