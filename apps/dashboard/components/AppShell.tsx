"use client";

import { Suspense, useState } from "react";
import Header from "./Header";
import VaultSidebar from "./VaultSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Note } from "@/lib/vault";

export default function AppShell({
  grouped,
  children,
}: {
  grouped: Record<string, Note[]>;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setMobileOpen((v) => !v)} />
      <div className="flex flex-1">
        <Suspense fallback={<Skeleton className="w-64 h-[calc(100vh-56px)]" />}>
          <VaultSidebar
            grouped={grouped}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </Suspense>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </>
  );
}
