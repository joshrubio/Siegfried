import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <div className="py-12 border-b">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Siegfried</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Control plane de desarrollo: vault con memoria y búsqueda semántica, y seguimiento
          operativo de cada proyecto satélite.
        </p>
        <Suspense fallback={<Skeleton className="h-11 w-64 mt-6" />}>
          <HeroStats />
        </Suspense>
      </div>
    </div>
  );
}
