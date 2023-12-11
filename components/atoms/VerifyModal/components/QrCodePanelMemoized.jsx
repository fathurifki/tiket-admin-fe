"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import QrReader from 'react-qr-scanner';
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { TicketContext } from "../context/TicketContext";

const QrCodePanel = ({ handleError, handleScan, handleManualCheckIn }) => {
    const { send } = useContext(TicketContext);
    const [manualCheckIn, setManualCheckIn] = useState("");
    return <div className=" shadow-md rounded px-4 pt-4 pb-4 mb-4 flex flex-col">
        <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }} />
        <div className="flex justify-between items-center mt-4 animate-slide">
            <Input
                value={manualCheckIn}
                onChange={(e) => setManualCheckIn(e.target.value)}
                placeholder="Manual Verification"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        send({ type: 'FOUND', payload: manualCheckIn });
                    }
                }} />
            <Button className="ml-4 bg-blue-200 hover:bg-blue-300 text-black font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => send({ type: 'MANUAL_CHECK', payload: manualCheckIn })}>Verify Ticket</Button>
        </div>
    </div>;
};
export const QrCodePanelMemoized = React.memo(QrCodePanel);
