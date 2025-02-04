import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-8 w-16" />
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
