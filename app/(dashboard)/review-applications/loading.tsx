import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Container from "@/components/Container";

export default function Loading() {
  return (
    <Container className="space-y-6 md:space-y-10">
      {/* Page Banner Loading */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-5 w-[450px]" />
      </div>

      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {/* Review Guidelines and Start Review Section */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:flex-row-reverse">
          <Card className="xl:w-2/3">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </CardContent>
          </Card>
          <div className="min-h-28 w-full flex-1 xl:w-1/3">
            <Skeleton className="h-full min-h-[112px] w-full" />
          </div>
        </div>

        {/* Leaderboard Link Loading */}
        <Skeleton className="h-12 w-full md:h-14 xl:h-16" />

        {/* System Status Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-[120px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Actions Section */}
        <div className="rounded-md border p-3 md:p-6">
          <Skeleton className="mb-4 h-6 w-[150px]" />
          <div className="flex flex-col gap-2.5 xl:flex-row">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
        </div>
      </div>
    </Container>
  );
}
