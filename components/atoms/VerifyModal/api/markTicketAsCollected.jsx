"use client";
import fetchingData from "@/lib/api";


export const markTicketAsCollected = async (ticketId) => {
    const url = `/admin/transaction/mark-collected/${ticketId}`;
    try {
        const response = await fetchingData({ url, method: 'POST' });
        return response.data;
    } catch (error) {
        throw error;
    }
};
