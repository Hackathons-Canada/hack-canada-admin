import Container from "@/components/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingLogCard() {
  return (
    <Card className="overflow-hidden bg-card shadow-sm">
      <CardHeader className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-0">
        {/* Previous/New Values Section */}
        <div className="space-y-3 rounded-lg border bg-card/50 p-3">
          <div>
            <Skeleton className="mb-1 h-3 w-24" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="mb-1 h-3 w-24" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>

        {/* Additional Context Section */}
        <div className="rounded-lg border bg-card/50 p-3">
          <Skeleton className="mb-1 h-3 w-32" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <Container className="space-y-6 md:space-y-10">
      {/* Page Banner Loading */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[180px]" />
        <Skeleton className="h-5 w-[380px]" />
      </div>

      <section aria-label="Audit Logs List" className="space-y-6 md:space-y-10">
        {/* Stats Loading */}
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <div className="space-y-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Log List Loading */}
        <div className="space-y-4 md:space-y-6">
          {[...Array(5)].map((_, i) => (
            <LoadingLogCard key={i} />
          ))}
        </div>

        {/* Pagination Loading */}
        <div className="mx-auto mt-8 max-w-lg rounded-xl border bg-card p-3">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </section>
    </Container>
  );
}
