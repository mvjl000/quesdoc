"use client";

import { format } from "date-fns";
import { Ghost, MessageSquare, Plus, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { FileSkeleton } from "@/components/Skeletons";

export const Files = () => {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  if (isLoading)
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
        {Array.from(Array(5).keys()).map((item) => (
          <FileSkeleton key={item} />
        ))}
      </div>
    );

  if (!files || files.length === 0)
    return (
      <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="w-8 h-8 text-zinc-800" />
        <p className="font-semibold text-xl">Pretty empty &apos;round here</p>
        <p>Let&apos;s upload your PDF.</p>
      </div>
    );

  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
      {files
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((file) => (
          <li
            key={file.id}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
          >
            <Link
              href={`/dashboard/${file.id}`}
              className="flex flex-col gap-2"
            >
              <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <p className="truncate text-lg font-medium text-zinc-900">
                      {file.name}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {format(new Date(file.createdAt), "MMM yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                14
              </div>
              <Button size="sm" variant="destructive" className="w-full">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </li>
        ))}
    </ul>
  );
};
