import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

const PageLoader = () => {
  return (
    <Container className="space-y-6 md:space-y-8">
      <Skeleton className="h-36 w-full" />
      <div className="flex space-y-6 max-xl:flex-col md:space-y-8 xl:space-x-8 xl:space-y-0">
        <Skeleton className="h-[600px] w-full max-w-4xl" />
        <Skeleton className="size-80" />
      </div>
    </Container>
  );
};
export default PageLoader;
