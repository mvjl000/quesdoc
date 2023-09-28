import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type MaxWidthWrapperProps = {
  children: ReactNode;
  className?: string;
};

export const MaxWidthWrapper = ({
  children,
  className,
}: MaxWidthWrapperProps) => (
  <div
    className={cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20", className)}
  >
    {children}
  </div>
);
