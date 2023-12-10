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
          <div>
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
              <Button className="ml-4" onClick={handleManualCheckIn}>Check In</Button>
            </div>
          </div>
          <div>
            <h2>Ticket Details</h2>
            <p>Event: Dummy Event</p>
            <p>Holder: John Doe</p>
            <p>Price: $100</p>
            <p>Status: Valid</p>
            {ticketInfo && (
              <div>
                {/* Display ticket info here */}
              </div>
            )}
            <Button className="bg-red-400 mt-4" type="submit" onClick={handleApprove}>
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyTicketModal;