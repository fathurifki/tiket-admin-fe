"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { TicketContext } from "../context/TicketContext";

export const TicketInfo = () => {
    const { fsm, send } = useContext(TicketContext);
    return <div className="bg-white shadow-sm rounded  flex flex-col">
        <div className="h-full mb-4 p-3 bg-white rounded-lg shadow-md flex items-center">
            <div className="m-auto">
                {/* <div className="bg-gray-100 p-2 rounded">FSM Context</div> */}
                {/* <div className="bg-gray-200 p-2 rounded">{JSON.stringify(fsm.context)}</div> */}
                {/* <div className="bg-gray-200 p-2 rounded">{JSON.stringify(fsm.value)}</div> */}
                {fsm.value === 'scanning' && (
                    <div className="flex justify-center items-center w-full">
                        <div className="animate-spin rounded-full mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                        <h2 className="text-center text-xl font-semibold">Scanning QR code...</h2>
                    </div>
                )}
                {fsm.value?.scannedValid === 'scanning' && (
                    <div className="flex justify-center items-center w-full">
                        <h2 className="text-center text-xl font-semibold">Scanning QR code...</h2>
                    </div>
                )}
                {fsm.value === 'scannedInvalid' && (
                    <div className="flex justify-center items-center w-full">
                        <h2 className="text-center text-xl font-semibold">Invalid QR code. Please try again.</h2>
                    </div>
                )}
                {fsm.value === 'scannedFound' && (
                    <div className="flex justify-center items-center w-full">
                        <h2 className="text-center text-xl font-semibold">Ticket Verification in progress...</h2>
                    </div>
                )}
                {fsm.value?.scannedValid === "idle" && (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ticket Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className={`flex justify-between mb-2 p-2 border-1 border-gray-300 rounded ${fsm.context.ticketDetail.order_detail.order_status === 'paid' ? 'bg-green-200' : ''}`}>
                                <span className="font-semibold text-md">Order Status:</span>
                                <span className="text-md">{fsm.context.ticketDetail.order_detail.order_status}</span>
                            </div>
                            <div className={`flex justify-between mb-2 p-2 border-1 border-gray-300 rounded ${fsm.context.ticketDetail.order_detail.ticket_collected ? 'bg-green-200' : 'bg-red-200'}`}>
                                <span className="font-semibold text-md">Ticket Collected:</span>
                                <span className="text-md">{fsm.context.ticketDetail.order_detail.ticket_collected ? '✓' : '✗'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md">
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Name:</span>
                                <span>{fsm.context.ticketDetail.order_detail.user_first_name} {fsm.context.ticketDetail.order_detail.user_last_name}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Order ID:</span>
                                <span>{fsm.context.ticketDetail.order_detail.order_id}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Invoice ID:</span>
                                <span>{fsm.context.ticketDetail.order_detail.invoice_id}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Total Price:</span>
                                <span>{fsm.context.ticketDetail.order_detail.total_price}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Order Date:</span>
                                <span>{new Date(fsm.context.ticketDetail.order_detail.order_date).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Payment Method:</span>
                                <span>{fsm.context.ticketDetail.order_detail.payment_method}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">User Email:</span>
                                <span>{fsm.context.ticketDetail.order_detail.user_email}</span>
                            </div>
                        </div>
                        <div className="flex mt-4 items-center justify-end">
                            <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => send({ type: "RESUME" })}>
                                Rescan
                            </Button>
                            <Button className="ml-2  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => send({ type: "COLLECTING" })} type="submit">
                                Distribute Ticket
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>

    </div>;
};
