"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PdfRendererProps = {
  url: string;
};

export const PdfRenderer = ({ url }: PdfRendererProps) => {
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex justify-between items-center px-2">
        <div className="flex items-center gap-1.5">top bar</div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <div className="">
          <Document file={url} className="max-h-full">
            <Page pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  );
};
