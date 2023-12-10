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
import { useReducer, useContext } from "react";
import fetchingData from "@/lib/api";


import { useMachine } from '@xstate/react';
import { createMachine, assign, fromPromise } from 'xstate';


const checkTicketValidity = async (ticketId) => {
    const url = `/admin/transaction/view/${ticketId}`;
    try {
        const response = await fetchingData({url});
        const isValid = response.data.order_detail.order_status === 'paid';
        return { valid: isValid };
    } catch (error) {
        throw error;
    }
}

const ticketMachine = createMachine({
    id: 'ticket',
    initial: 'scanning',
    context: {
        ticketId : ""
    },
    states: {
        scanning: {
            on: {
                FOUND: {
                    target: 'scannedFound',
                    actions: assign({ ticketId: (data) => {
                        return data?.event?.payload}

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
                        }
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
            on: {
                RESUME: 'scanning'
            }
        },
        scannedInvalid: {
            on: {
                RESUME: 'scanning'
            }
        }
    }
});

const TicketContext = React.createContext();

const initialState = {
    ticketId: "",
    manualCheckIn: "",
    ticketInfo: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_TICKET_ID':
            return { ...state, ticketId: action.payload };
        case 'SET_MANUAL_CHECK_IN':
            return { ...state, manualCheckIn: action.payload };
        case 'SET_TICKET_INFO':
            return { ...state, ticketInfo: action.payload };
        default:
            throw new Error();
    }
};


export const VerifyTicketModal = ({ children, ...props }) => {

    // const [state, dispatch] = useReducer(reducer, initialState);
    const [fsm, send] = useMachine(ticketMachine);

    const handleScan = data => {
        if (data) {
            send({ type: 'FOUND', payload: data?.text });
        }
    }

    const handleManualCheckIn = () => {

    }

    const handleError = err => {
        console.error(err);
    }

    const handleApprove = () => {
        // Handle ticket approval logic here
    };

    return (
        <TicketContext.Provider value={{ fsm, send }}>
            <Dialog open={props.open} onOpenChange={props.onOpenChange}>
                <DialogContent className="sm:max-w-[1000px] grid gap-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Verify Ticket </DialogTitle>
                        <p>Current State: {fsm.value}</p>
                        <p>Ticket ID: {fsm.context.ticketId}</p>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <QrCodePanelMemoized handleError={()=>{}} handleScan={handleScan} />
                        <TicketInfo />
                    </div>
                </DialogContent>
            </Dialog>
        </TicketContext.Provider>
    );
};

const TicketInfo = () => {
    const { state } = useContext(TicketContext);
    return <div className="bg-white shadow-sm rounded  flex flex-col">
        <div className="mb-4 p-3 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ticket Details</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-md">
                <div className="bg-gray-100 p-2 rounded">Event</div>
                <div className="bg-gray-200 p-2 rounded">{state?.ticketId}</div>
                <div className="bg-gray-100 p-2 rounded">Holder</div>
                <div className="bg-gray-200 p-2 rounded">John Doe</div>
                <div className="bg-gray-100 p-2 rounded">Price</div>
                <div className="bg-gray-200 p-2 rounded">$100</div>
                <div className="bg-gray-100 p-2 rounded">Status</div>
                <div className="bg-gray-200 p-2 rounded">Valid</div>
            </div>
        </div>
        <div className="flex mr-4 items-center justify-end">
            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" >
                Approve
            </Button>
        </div>
    </div>;
}


const QrCodePanel = ({ handleError, handleScan, manualCheckIn, setManualCheckIn, handleManualCheckIn }) => {
    const { state, dispatch } = useContext(TicketContext);
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
                placeholder="Manual Check In"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleManualCheckIn();
                    }
                }} />
            <Button className="ml-4 bg-blue-200 hover:bg-blue-300 text-black font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleManualCheckIn}>Verify Ticket</Button>
        </div>
    </div>;
}
const QrCodePanelMemoized = React.memo(QrCodePanel)
