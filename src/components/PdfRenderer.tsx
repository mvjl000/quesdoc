"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useToast } from "@/components/ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PdfRendererProps = {
  url: string;
};

export const PdfRenderer = ({ url }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currPage, setCurrPage] = useState(1);
  const { width, ref } = useResizeDetector();
  const { toast } = useToast();

  const PREV_PAGE_DISABLED = currPage <= 1;
  const NEXT_PAGE_DISABLED =
    typeof numPages === "number" && currPage >= numPages;

  const handleChangePage = (direction: "prev" | "next") => {
    switch (direction) {
      case "prev":
        if (PREV_PAGE_DISABLED) return;

        setCurrPage(currPage - 1);
        break;
      case "next":
        if (NEXT_PAGE_DISABLED) return;

        setCurrPage(currPage + 1);
        break;
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex justify-between items-center px-2">
        <div className="flex items-center gap-1.5">
          <Button
            aria-label="previous page"
            variant="ghost"
            onClick={() => handleChangePage("prev")}
            disabled={PREV_PAGE_DISABLED}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>

          <Button
            aria-label="next page"
            variant="ghost"
            onClick={() => handleChangePage("next")}
            disabled={NEXT_PAGE_DISABLED}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input className="w-12 h-8" value={currPage} />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <div ref={ref} className="">
          <Document
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 w-6 h-6 animate-spin" />
              </div>
            }
            onLoadError={() => {
              toast({
                title: "Error loading PDF!",
                description: "Please try again later.",
                variant: "destructive",
              });
            }}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
            file={url}
            className="max-h-full"
          >
            <Page width={width ? width : 1} pageNumber={currPage} />
          </Document>
        </div>
      </div>
    </div>
  );
};
