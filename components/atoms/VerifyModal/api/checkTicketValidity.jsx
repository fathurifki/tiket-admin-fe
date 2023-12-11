"use client";
import fetchingData from "@/lib/api";

export const checkTicketValidity = async (ticketId) => {
    const url = `/admin/transaction/view/${ticketId}`;
    try {
        const response = await fetchingData({ url });
        const isValid = response.data.order_detail.order_status === 'paid';
        return { valid: isValid, order_detail: response.data.order_detail };
    } catch (error) {
        throw error;
    }
};
