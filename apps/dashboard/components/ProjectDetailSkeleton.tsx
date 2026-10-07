import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96 mt-3" />
      <Skeleton className="h-24 w-full mt-6" />
      <Skeleton className="h-40 w-full mt-8" />
    </div>
  );
}
