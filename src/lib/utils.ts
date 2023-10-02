import { type ClassValue, clsx } from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

// helps with merging tailwind classNames
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
