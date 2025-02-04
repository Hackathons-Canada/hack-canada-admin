import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

const PageLoader = () => {
  return (
    <Container>
      {/* Banner Skeleton */}
      <div className="mb-6 space-y-2 md:mb-8">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-5 w-full max-w-[600px]" />
      </div>

      <div className="flex flex-col gap-8 md:gap-12">
        {/* Users Section */}
        <section className="space-y-2">
          <Skeleton className="h-7 w-[100px]" />

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
          </div>
        </section>

        {/* Applications Section */}
        <section className="space-y-2">
          <Skeleton className="h-7 w-[150px]" />

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
          </div>
        </section>
      </div>
    </Container>
  );
};

export default PageLoader;
