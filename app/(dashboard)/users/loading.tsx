import Container from "@/components/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingSearchControls() {
  return (
    <section aria-label="Search and Download Controls">
      <div className="flex items-start justify-between gap-8 max-2xl:flex-col-reverse">
        <div className="w-full flex-1">
          {/* Search Controls */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-10 w-64" /> {/* Search input */}
              <Skeleton className="h-10 w-32" /> {/* Role select */}
              <Skeleton className="h-10 w-32" /> {/* Status select */}
            </div>
          </div>
        </div>
        <div className="w-full shrink-0 lg:w-auto">
          {/* Download Options */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <Container className="space-y-10">
      {/* Page Banner Loading */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-5 w-[450px]" />
      </div>

      <div className="space-y-10">
        {/* Search Controls Loading */}
        <LoadingSearchControls />

        <section aria-label="Users List" className="space-y-6">
          {/* Users Stats Loading */}
          <Skeleton className="h-5 w-80 max-md:mx-auto" />

          {/* Users Table Loading */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px] py-4" />
                  <TableHead className="py-4">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="py-4">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="py-4">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="py-4">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(10)].map((_, i) => (
                  <TableRow
                    key={i}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="text-center">
                      <Skeleton className="mx-auto h-5 w-5" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Loading */}
          <div className="mx-auto mt-8 max-w-lg rounded-xl border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}
