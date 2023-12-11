"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCallback } from "react";


import { useMachine } from '@xstate/react';
import { ticketMachine } from "./machine/ticketMachine";
import { TicketInfo } from "./components/TicketInfo";
import { QrCodePanelMemoized } from "./components/QrCodePanelMemoized";
import { TicketContext } from "./context/TicketContext";


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
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => send({ type: "COLLECT" })}>Confirm</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => send({ type: "CLOSE" })}>Cancel</button>
                    </div>
                </DialogContent>
            </Dialog>
        </TicketContext.Provider>
    );
};


