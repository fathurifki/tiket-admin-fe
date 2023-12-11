"use client";
import { createMachine, fromPromise } from 'xstate';
import { checkTicketValidity } from "../api/checkTicketValidity";
import { setTicketIdAction, isValidTicket, setTicketDetailAction, isInvalidTicket } from './setTicketIdAction';
import { useMachine } from '@xstate/react';
import { useCallback } from 'react';

export const ticketMachine = createMachine({
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
                    actions: setTicketIdAction
                },
                MANUAL_CHECK: {
                    target: 'scannedFound',
                    actions: setTicketIdAction
                },
                NOT_FOUND: 'scannedNotFound'
            }
        },
        scannedFound: {
            on: {
                RESUME: 'scanning',
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
                        guard: isValidTicket,
                        actions: setTicketDetailAction,
                    },
                    {
                        target: 'scannedInvalid',
                        guard: isInvalidTicket
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
                        COLLECTING: 'collecting',
                        MANUAL_CHECK: {
                            target: '#ticket.scannedFound',
                            actions: setTicketIdAction
                        },
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

export const useTicketMachine = () => {
    const [state, send] = useMachine(ticketMachine);
    const handleScan = useCallback((data) => data && send({ type: 'FOUND', payload: data.text }), []);
    const handleError = useCallback(() => { }, []);
    const handleCollect = useCallback(() => send({ type: "COLLECT" }), []);
    const handleClose = useCallback(() => send({ type: "CLOSE" }), []);
    return { state, send, handleScan, handleError, handleCollect, handleClose };
};

