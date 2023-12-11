"use client";
import { assign } from 'xstate';

export const setTicketIdAction = assign({
    ticketId: (data) => {
        return data?.event?.payload;
    }
});
export const setTicketDetailAction = assign({ ticketDetail: ({ event }) => event.output });
export const isValidTicket = (result) => {
    return result.event.output.valid;
};
export const isInvalidTicket = (result) => {
    return !result.event.output.valid;
};
