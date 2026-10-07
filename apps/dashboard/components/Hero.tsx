import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroStats from "./HeroStats";
import HeroGraph from "./HeroGraph";

export default function Hero() {
  return (
    <div className="py-12 border-b overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6">
        <HeroGraph />
        <h1 className="text-3xl font-semibold tracking-tight animate-fade-in-up">Siegfried</h1>
        <p
          className="text-muted-foreground mt-2 max-w-xl animate-fade-in-up"
          style={{ animationDelay: "0.08s" }}
        >
          Control plane de desarrollo: vault con memoria y búsqueda semántica, y seguimiento
          operativo de cada proyecto satélite.
        </p>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.16s" }}>
          <Suspense fallback={<Skeleton className="h-11 w-64 mt-6" />}>
            <HeroStats />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
