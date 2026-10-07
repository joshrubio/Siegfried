import { Suspense } from "react";
import VaultNote from "@/components/VaultNote";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  return (
    <main className="max-w-3xl px-8 py-10">
      <Suspense
        fallback={
          <div>
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-4 w-40 mt-3" />
            <Skeleton className="h-64 w-full mt-8" />
          </div>
        }
      >
        <VaultNote params={params} />
      </Suspense>
    </main>
  );
}
