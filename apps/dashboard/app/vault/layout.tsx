import { Suspense } from "react";
import { listNotes, groupByFolder } from "@/lib/vault";
import VaultSidebar from "@/components/VaultSidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  const grouped = groupByFolder(listNotes());

  return (
    <div className="flex">
      <Suspense fallback={<Skeleton className="w-64 h-[calc(100vh-56px)]" />}>
        <VaultSidebar grouped={grouped} />
      </Suspense>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
