"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnOpenChange = (visible: boolean) => {
    if (!visible) {
      setIsOpen(visible);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild={true}>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>Content</DialogContent>
    </Dialog>
  );
};
