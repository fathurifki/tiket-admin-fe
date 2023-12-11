"use client";
import { createMachine, assign, fromPromise } from 'xstate';
import { checkTicketValidity } from "../api/checkTicketValidity";

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
                    actions: assign({
                        ticketId: (data) => {
                            return data?.event?.payload;
                        }
                    })
                },
                MANUAL_CHECK: {
                    target: 'scannedFound',
                    actions: assign({
                        ticketId: (data) => {
                            return data?.event?.payload;
                        }
                    })
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
                        COLLECTING: 'collecting',
                        MANUAL_CHECK: {
                            target: '#ticket.scannedFound',
                            actions: assign({
                                ticketId: (data) => {
                                    return data?.event?.payload;
                                }
                            })
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
