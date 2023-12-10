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

export const VerifyTicketModal = ({children, ...props}) => {
  const [ticketId, setTicketId] = useState("");
  const [manualCheckIn, setManualCheckIn] = useState("");
  const [ticketInfo, setTicketInfo] = useState(null);

  const handleScan = data => {
    if (data) {
      setTicketId(data);
      // Fetch ticket info and set it
      // setTicketInfo(fetchedData);
    }
  }

  const handleManualCheckIn = () => {
    // Handle manual check in logic here
    // Fetch ticket info and set it
    // setTicketInfo(fetchedData);
  }

  const handleError = err => {
    console.error(err);
  }

  const handleApprove = () => {
    // Handle ticket approval logic here
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] grid gap-4 py-4">
        <DialogHeader>
          <DialogTitle>Verify Ticket</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
            <div className="flex justify-between items-center mt-4">
              <Input
                value={manualCheckIn}
                onChange={(e) => setManualCheckIn(e.target.value)}
                placeholder="Manual Check In"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualCheckIn();
                  }
                }}
              />
              <Button className="ml-4 bg-blue-200 hover:bg-blue-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleManualCheckIn}>Verify Ticket</Button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="mb-4">
              <h2 className="font-bold text-2xl mb-2">Ticket Details</h2>
              <p className="text-gray-700 text-base">Event: Dummy Event</p>
              <p className="text-gray-700 text-base">Holder: John Doe</p>
              <p className="text-gray-700 text-base">Price: $100</p>
              <p className="text-gray-700 text-base">Status: Valid</p>
            </div>
            {ticketInfo && (
              <div className="mb-4">
                {/* Display ticket info here */}
              </div>
            )}
            <div className="flex items-center justify-between">
              <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onClick={handleApprove}>
                Approve
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyTicketModal;