"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import Dropzone from "react-dropzone";
import { CloudIcon, FileIcon } from "lucide-react";

const UploadDropzone = () => {
  return (
    <Dropzone
      multiple={false}
      onDrop={(acceptedFile) => {
        console.log(acceptedFile);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="w-full h-full flex justify-center items-center">
            <label
              htmlFor="dropzone-file"
              className="w-full h-full flex flex-col justify-center items-center rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col justfy-center items-center pt-5 pb-6">
                <CloudIcon className="w-6 h-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Drag and drop</span> or click
                  to upload
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="m-w-xd bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <FileIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

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
      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};
