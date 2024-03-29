"use client";

import TitlePage from "@/components/atoms/TitlePage";
import { Box, Card, Flex } from "@radix-ui/themes";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { IoTicketSharp } from "react-icons/io5";
import { MdEvent, MdOutlineSell } from "react-icons/md";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import fetchingData from "@/lib/api";
import { use, useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/lib/useDebounce";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DashboardPage({ data }) {
  const [state, setState] = useState({
    idValue: "",
    labelValue: "",
    rangeDays: "",
    dataLabel: {},
    loading: false,
    mount: false,
    ticketObj: {},
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      mount: true,
    }));
  }, [state.loading]);

  async function fetchingAllEvent(value) {
    const params = {
      name: value || "",
    };
    const urlParams = new URLSearchParams(params).toString();
    const res = await fetchingData({
      url: `/admin/dashboard/all_events?${urlParams}`,
    });
    if (res?.status === 200) {
      return res?.data?.map((val) => ({
        value: val.id,
        label: val.name,
      }));
    }
  }

  const fetchingAllTransaction = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    const params = {
      event_id: state?.idValue || "",
      range_days: state?.rangeDays || "",
    };
    const urlParams = new URLSearchParams(params).toString();
    const res = await fetchingData({
      url: `/admin/dashboard/event_sales?${urlParams}`,
    });
    if (res && res?.status === 200) {
      const labels =
        (res?.data &&
          res?.data?.event_sales?.map((val) =>
            format(new Date(val?.order_date), "dd-MM-yyyy")
          )) ||
        [];
      const data =
        (res?.data && res?.data?.event_sales?.map((val) => val?.ticket_sold)) ||
        [];
      const response = {
        labels,
        datasets: [
          {
            label: state?.idValue !== "" ? state.labelValue : "All",
            data,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
      const objResponse = {
        total_events: res?.data?.total_events || 0,
        total_revenue: res?.data?.total_revenue || 0,
        total_tickets: res?.data?.total_tickets || 0,
      };
      setState((prev) => ({
        ...prev,
        dataLabel: response || {},
        ticketObj: objResponse || {},
        loading: false,
      }));
    }
  }, [state?.idValue, state?.rangeDays]);

  useEffect(() => {
    fetchingAllTransaction();
  }, [fetchingAllTransaction]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const dataLabel = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <TitlePage title="Dashboard" />
      <div className="grid grid-cols-2 gap-4">
        <Box>
          <div className="border rounded-lg">
            <div className="flex flex-row justify-between p-4 items-center">
              <div className="flex flex-col">
                <b>Total Event</b>
                <span>{state.ticketObj?.total_events}</span>
              </div>
              <div>
                <MdEvent size={30} />
              </div>
            </div>
          </div>
        </Box>
        <Box>
          <div className="border rounded-lg">
            <div className="flex flex-row justify-between p-4 items-center">
              <div className="flex flex-col">
                <b>Total Tiket Terjual</b>
                <span>{state.ticketObj?.total_tickets}</span>
              </div>
              <div>
                <IoTicketSharp size={30} />
              </div>
            </div>
          </div>
        </Box>

        <Box>
          <div className="border rounded-lg">
            <div className="flex flex-row justify-between p-4 items-center">
              <div className="flex flex-col">
                <b>Total Penjualan</b>
                <span>
                  {formatter.format(state.ticketObj?.total_revenue || 0)}
                </span>
              </div>
              <div>
                <MdOutlineSell size={30} />
              </div>
            </div>
          </div>
        </Box>
        <div className="flex flex-col p-[1vh]">
          <b className="mb-2">Event</b>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={fetchingAllEvent}
            onChange={(e) =>
              setState({ idValue: e?.value || "", labelValue: e?.label || "" })
            }
            isClearable
            placeholder="Pilih Event"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-[1vh] mt-2">
        <span>Transaction Overview</span>
        {state.idValue !== "" && (
          <Select
            options={[
              { value: "7", label: "Week" },
              { value: "30", label: "Month" },
              { value: "90", label: "Quarter" },
              { value: "365", label: "Year" },
            ]}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                rangeDays: e?.value,
              }))
            }
          />
        )}
        {state.mount && !state.loading && (
          <Line options={options} data={state?.dataLabel} />
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
