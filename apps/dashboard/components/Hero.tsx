import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroStats from "./HeroStats";
import HeroGraph from "./HeroGraph";
import HeroBackdrop from "./HeroBackdrop";

export default function Hero() {
  return (
    <div className="relative border-b overflow-hidden">
      <HeroBackdrop />
      <div className="relative max-w-6xl mx-auto px-6 lg:min-h-[620px] flex items-center">
        <HeroGraph />
        <div className="relative max-w-2xl py-14 lg:py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight animate-fade-in-up bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent pb-1">
            Siegfried
          </h1>
          <p
            className="text-base sm:text-lg lg:text-xl text-muted-foreground mt-4 lg:mt-5 max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.08s" }}
          >
            Development control plane: a vault with memory and semantic search, plus operational
            tracking for every satellite project.
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.16s" }}>
            <Suspense fallback={<Skeleton className="h-14 w-72 mt-8 lg:mt-10" />}>
              <HeroStats />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
