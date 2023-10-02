"use client";

import { Ghost } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { FileSkeleton } from "@/components/Skeletons";
import { File } from "@/components/dashboard/File";

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
          <File key={file.id} data={file} />
        ))}
    </ul>
  );
};
