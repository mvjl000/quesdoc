"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import Dropzone, { DropEvent, FileRejection } from "react-dropzone";
import { CloudIcon, FileIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

type onDrop =
  | (<T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => void)
  | undefined;

const UploadDropzone = () => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();
  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevValue) => {
        if (prevValue >= 95) {
          clearInterval(interval);
          return prevValue;
        }

        return prevValue + 5;
      });
    }, 500);

    return interval;
  };

  const handleOnDrop: onDrop = async (file) => {
    setIsUploading(true);

    const progressInterval = startSimulatedProgress();

    // file upload here
    const res = await startUpload(file);

    if (!res) {
      return toast({
        title: "Something went wrong res",
        description: "Please try again later",
        variant: "destructive",
      });
    }

    const [fileResponse] = res;

    const key = fileResponse.key;

    if (!key) {
      return toast({
        title: "Something went wrong key",
        description: "Please try again later",
        variant: "destructive",
      });
    }

    clearInterval(progressInterval);
    setUploadProgress(100);

    startPolling({ key });
  };

  return (
    <Dropzone multiple={false} onDrop={handleOnDrop}>
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

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                </div>
              ) : null}
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                {...getInputProps()}
              />
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
