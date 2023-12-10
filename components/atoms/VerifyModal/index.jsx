"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QrReader from 'react-qr-scanner'
import { Input } from "@/components/ui/input";
import { useReducer, useContext, useCallback } from "react";
import fetchingData from "@/lib/api";


import { useMachine } from '@xstate/react';
import { createMachine, assign, fromPromise } from 'xstate';


const checkTicketValidity = async (ticketId) => {
    const url = `/admin/transaction/view/${ticketId}`;
    try {
        const response = await fetchingData({ url });
        const isValid = response.data.order_detail.order_status === 'paid';
        return { valid: isValid, order_detail: response.data.order_detail };
    } catch (error) {
        throw error;
    }
}

const ticketMachine = createMachine({
    id: 'ticket',
    initial: 'scanning',
    context: {
        ticketId: ""
    },
    states: {
        scanning: {
            on: {
                FOUND: {
                    target: 'scannedFound',
                    actions: assign({
                        ticketId: (data) => {
                            return data?.event?.payload
                        }

                    })
                },
                NOT_FOUND: 'scannedNotFound'
            }
        },
        scannedFound: {
            on: {
                RESUME: 'scanning'
            },
            invoke: {
                src: fromPromise((context) => {
                    return checkTicketValidity(context.input.ticketId);
                }),
                input: ({ context }) => {
                    return { ticketId: context.ticketId };
                },
                onDone: [
                    {
                        target: 'scannedValid',
                        guard: (result) => {
                            return result.event.output.valid;
                        },
                        actions: assign({ ticketDetail: ({ event }) => event.output }),
                    },
                    {
                        target: 'scannedInvalid',
                        guard: (result) => {
                            return !result.event.output.valid;
                        }
                    }
                ],
                onError: {
                    target: 'scannedInvalid',
                    // actions: (_, event) => console.error(event.data)
                }
            }
        },
        scannedNotFound: {
            on: {
                RESUME: 'scanning'
            }
        },
        scannedValid: {
            initial: "idle",
            states: {
                idle: {
                    on: {
                        RESUME: '#ticket.scanning',
                        COLLECTING: 'collecting'
                    }
                },
                scanning: {},
                collecting: {
                    on: {
                        CLOSE: "idle"
                    }
                }
            }
        },
        scannedInvalid: {
            after: {
                2000: 'scanning'
            }
        }
    }
});

const TicketContext = React.createContext();

export const VerifyTicketModal = ({ children, ...props }) => {

    const [fsm, send] = useMachine(ticketMachine);

    const handleScan = useCallback((data) => {
        if (data) {
            send({ type: 'FOUND', payload: data?.text });
        }
    }, []);
    const handleError = useCallback(() => { }, []);

    return (
        <TicketContext.Provider value={{ fsm, send }}>
            <Dialog open={props.open} onOpenChange={props.onOpenChange}>
                <DialogContent className="sm:max-w-[1000px] grid gap-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Verify Ticket </DialogTitle>
                        {/* <p>Current State: {fsm.value}</p> */}
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <QrCodePanelMemoized handleError={handleError} handleScan={handleScan} />
                        <TicketInfo />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={fsm.value?.scannedValid === 'collecting'} onOpenChange={(open) => { console.log(open); send({ type: "CLOSE" }); }}>
                <DialogContent className="sm:max-w-[1000px] grid gap-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Collect Ticket </DialogTitle>
                    </DialogHeader>
                    <p>Please provide the following quantity of tickets:</p>
                    <h2 className="text-xl font-semibold mb-2">{fsm?.context?.ticketDetail?.order_detail?.orders[0]?.order_event_name}</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-lg rounded">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Package Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {fsm?.context?.ticketDetail?.order_detail?.orders.map((order, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-lg text-gray-900 font-bold">{order.order_package_type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-lg text-gray-900 font-bold">{order.order_item_quantity}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => send({ type: "COLLECT" })}>Collect</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => send({ type: "CLOSE" })}>Cancel</button>
                    </div>
                </DialogContent>
            </Dialog>
        </TicketContext.Provider>
    );
};

const TicketInfo = () => {
    const { fsm, send } = useContext(TicketContext);
    return <div className="bg-white shadow-sm rounded  flex flex-col">
        <div className="h-full mb-4 p-3 bg-white rounded-lg shadow-md flex items-center">
            <div className="m-auto">
                {/* <div className="bg-gray-100 p-2 rounded">FSM Context</div> */}
                {/* <div className="bg-gray-200 p-2 rounded">{JSON.stringify(fsm.context)}</div> */}
                {/* <div className="bg-gray-200 p-2 rounded">{JSON.stringify(fsm.value)}</div> */}
                {fsm.value === 'scanning' && (
                    <div className="flex justify-center items-center w-full">
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
                            <Button className="ml-2  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => send({ type: "COLLECTING" })} type="submit" >
                                Collect Ticket
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>

    </div>;
}


const QrCodePanel = ({ handleError, handleScan, handleManualCheckIn }) => {
    const { fsm, send } = useContext(TicketContext);
    const [manualCheckIn, setManualCheckIn] = useState("");
    return <div className="bg-gray-800 shadow-sm rounded px-4 pt-4 pb-4 mb-4 flex flex-col">
        <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }} />
        <div className="flex justify-between items-center mt-4">
            <Input
                value={manualCheckIn}
                onChange={(e) => setManualCheckIn(e.target.value)}
                placeholder="Manual Verification"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        send({ type: 'FOUND', payload: manualCheckIn });
                    }
                }} />
            <Button className="ml-4 bg-blue-200 hover:bg-blue-300 text-black font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=> send({ type: 'FOUND', payload: manualCheckIn })}>Verify Ticket</Button>
        </div>
    </div>;
}
const QrCodePanelMemoized = React.memo(QrCodePanel)
