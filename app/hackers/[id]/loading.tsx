import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

const PageLoader = () => {
  return (
    <Container className="space-y-6 md:space-y-8">
      <Skeleton className="h-36 w-full" />
      <div className="flex space-y-6 max-xl:flex-col md:space-y-8 xl:space-x-8 xl:space-y-0">
        <div className="flex w-full max-w-4xl flex-col space-y-6 md:space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Skeleton className="size-80" />
      </div>
    </Container>
  );
};
export default PageLoader;
