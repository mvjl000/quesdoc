"use client";

import { format } from "date-fns";
import { Loader2, MessageSquare, Plus, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { File as FileType } from "@/types/file";

type FileProps = {
  // those types from prisma client are of type Date, from trpc their type is string
  data: FileType;
};

export const File = ({ data }: FileProps) => {
  const utils = trpc.useContext();

  const { mutate: deleteFile, isLoading: isDeletingLoading } =
    trpc.deleteFile.useMutation({
      onSuccess: () => {
        utils.getUserFiles.invalidate();
      },
    });

  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg">
      <Link href={`/dashboard/${data.id}`} className="flex flex-col gap-2">
        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <p className="truncate text-lg font-medium text-zinc-900">
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {format(new Date(data.createdAt), "MMM yyyy")}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          14
        </div>
        <Button
          size="sm"
          variant="destructive"
          className="w-full"
          onClick={() => deleteFile({ id: data.id })}
          disabled={isDeletingLoading}
        >
          {isDeletingLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <TrashIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </li>
  );
};
