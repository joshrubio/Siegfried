import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectDetail from "@/components/ProjectDetail";
import ProjectDetailSkeleton from "@/components/ProjectDetailSkeleton";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Siegfried
      </Link>

      <div className="mt-4">
        <Suspense fallback={<ProjectDetailSkeleton />}>
          <ProjectDetail params={params} />
        </Suspense>
      </div>
    </main>
  );
}
