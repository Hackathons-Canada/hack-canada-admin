import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Stats Loading Component
function StatsLoading() {
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

// Application Review Loading Component
function ApplicationReviewLoading() {
  return (
    <Card className="space-y-6 p-6 md:space-y-10">
      {/* Application Info Loading */}
      <Card className="w-full bg-gradient-to-br from-background via-background/80 to-background">
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <hr className="mb-4" />
        <CardContent>
          <div className="grid w-full gap-y-3">
            {/* Personal Information */}
            <Skeleton className="h-6 w-[180px]" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}

            {/* Education */}
            <Skeleton className="mt-4 h-6 w-[120px]" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}

            {/* Links & Social */}
            <Skeleton className="mt-4 h-6 w-[150px]" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}

            {/* Experience */}
            <Skeleton className="mt-4 h-6 w-[120px]" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}

            {/* Short Answers */}
            <Skeleton className="mt-4 h-6 w-[150px]" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="ml-6 h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Interface Loading */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[80px]" />
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="container max-w-screen-xl space-y-6 py-6">
      <StatsLoading />
      <ApplicationReviewLoading />
    </div>
  );
}
