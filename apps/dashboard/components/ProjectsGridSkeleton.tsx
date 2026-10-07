import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsGridSkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-72 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    </div>
  );
}
