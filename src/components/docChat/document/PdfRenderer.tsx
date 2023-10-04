"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CornerUpRight,
  Loader2,
  SearchIcon,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useToast } from "@/components/ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SimpleBar from "simplebar-react";
import { PdfFullscreen } from "@/components/docChat/document/PdfFullscreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PdfRendererProps = {
  url: string;
};

const PdfLoader = () => (
  <div className="flex justify-center">
    <Loader2 className="my-24 w-6 h-6 animate-spin" />
  </div>
);

export const PdfRenderer = ({ url }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currPage, setCurrPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  // helps prevent flickering while changing scale
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const { width, ref } = useResizeDetector();
  const { toast } = useToast();

  const formSchema = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type FormSchemaType = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormSchemaType>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(formSchema),
  });

  const PREV_PAGE_DISABLED = currPage <= 1;
  const NEXT_PAGE_DISABLED =
    typeof numPages === "number" && currPage >= numPages;

  const handleChangePage = (direction: "prev" | "next") => {
    switch (direction) {
      case "prev": {
        if (PREV_PAGE_DISABLED) return;

        const value = currPage - 1;

        setCurrPage(value);
        setValue("page", String(value));
        break;
      }
      case "next": {
        if (NEXT_PAGE_DISABLED) return;

        const value = currPage + 1;

        setCurrPage(value);
        setValue("page", String(value));
        break;
      }
    }
  };

  const handlePageSubmit = ({ page }: FormSchemaType) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
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
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant="ghost" className="gap-1.5">
                <SearchIcon className="w-4 h-4" />
                {scale * 100}%
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(0.75)}>
                75%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="rotate 90 degrees"
            variant="ghost"
            onClick={() => setRotation(rotation + 90)}
          >
            <CornerUpRight className="w-4 h-4" />
          </Button>
          <PdfFullscreen fileUrl={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={<PdfLoader />}
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
              {isLoading && renderedScale ? (
                <Page
                  key={`@${renderedScale}`}
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                />
              ) : null}
              <Page
                key={`@${scale}`}
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                onRenderSuccess={() => setRenderedScale(scale)}
                className={cn(isLoading ? "hidden" : "")}
                loading={<PdfLoader />}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};
