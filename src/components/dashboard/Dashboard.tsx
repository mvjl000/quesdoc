import { UploadButton } from "@/components/dashboard/UploadButton";
import { Files } from "@/components/dashboard/Files";

export const Dashboard = () => {
  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col justify-between items-start gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My files</h1>
        <UploadButton />
      </div>
      <Files />
    </main>
  );
};
