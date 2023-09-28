import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// helps with merging tailwind classNames
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
