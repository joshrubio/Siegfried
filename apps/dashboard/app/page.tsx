import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectsSection from "@/components/ProjectsSection";
import ProjectsGridSkeleton from "@/components/ProjectsGridSkeleton";
import Hero from "@/components/Hero";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <Hero />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Proyectos</h2>
          <Suspense fallback={<ProjectsGridSkeleton />}>
            <ProjectsSection />
          </Suspense>
        </section>

        <Separator className="mb-10" />

        <section>
          <Link
            href="/vault"
            className="group flex items-center justify-between rounded-xl border p-5 hover:border-foreground/30 transition-colors"
          >
            <div>
              <h2 className="text-lg font-semibold">Vault</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Investigación, decisiones y specs — navegable y con búsqueda semántica.
              </p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>
      </main>
    </>
  );
}
