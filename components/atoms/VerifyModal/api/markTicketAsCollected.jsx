"use client";
import fetchingData from "@/lib/api";


export const markTicketAsCollected = async (orderID) => {
    const url = `/admin/transaction/ticket_received/${orderID}`;
    try {
        const response = await fetchingData({ url, method: 'PUT' });
        return response.data;
    } catch (error) {
        throw error;
    }
};
