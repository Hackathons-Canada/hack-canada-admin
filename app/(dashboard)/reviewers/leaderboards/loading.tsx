import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <Container className="space-y-6 md:space-y-10">
      {/* Page Banner Loading */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" /> {/* Back button */}
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <Skeleton className="h-5 w-[400px]" />
      </div>

      <div className="space-y-4">
        {/* Table Header Section */}
        <div>
          <Skeleton className="h-6 w-[150px] md:h-7" />
          <Skeleton className="mt-1 h-4 w-[280px] md:h-5" />
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px] py-4">
                  <Skeleton className="h-5 w-12" />
                </TableHead>
                <TableHead className="py-4">
                  <Skeleton className="h-5 w-20" />
                </TableHead>
                <TableHead className="py-4 text-center">
                  <Skeleton className="mx-auto h-5 w-16" />
                </TableHead>
                <TableHead className="py-4 text-center">
                  <Skeleton className="mx-auto h-5 w-20" />
                </TableHead>
                <TableHead className="py-4 text-right">
                  <Skeleton className="ml-auto h-5 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* 10 skeleton rows */}
              {[...Array(10)].map((_, i) => (
                <TableRow
                  key={i}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Skeleton className="mx-auto h-5 w-8" />
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Skeleton className="mx-auto h-5 w-16" />
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Skeleton className="ml-auto h-5 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Container>
  );
}
