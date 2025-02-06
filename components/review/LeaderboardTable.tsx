import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Medal } from "lucide-react";
import { type LeaderboardStats } from "@/lib/services/reviewer-stats";
import Link from "next/link";

interface LeaderboardTableProps {
  stats: LeaderboardStats[];
  currentUserRole: UserRole;
}

export default function LeaderboardTable({
  stats,
  currentUserRole,
}: LeaderboardTableProps) {
  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-700";
      default:
        return "hidden";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium md:text-lg">Current Rankings</h3>
        <p className="text-xs text-muted-foreground md:text-sm">
          Ranked by total number of applications reviewed
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 transition-colors hover:bg-muted">
              <TableHead className="w-[50px] py-4 font-semibold">
                Rank
              </TableHead>
              <TableHead className="py-4 font-semibold">Reviewer</TableHead>
              <TableHead className="py-4 text-center font-semibold">
                Reviews
              </TableHead>
              <TableHead className="py-4 text-center font-semibold">
                Avg. Rating
              </TableHead>
              <TableHead className="py-4 text-right font-semibold">
                Total Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((reviewer, index) => (
              <TableRow
                key={reviewer.id}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5">
                    <span>{index + 1}</span>
                    <Medal className={getMedalColor(index)} size={16} />
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {currentUserRole === "admin" ? (
                    <Link
                      href={`/reviewers?reviewer=${reviewer.id}`}
                      className="block w-fit underline underline-offset-2"
                    >
                      {reviewer.name}
                    </Link>
                  ) : (
                    <p>{reviewer.name}</p>
                  )}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {reviewer.reviewCount}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {reviewer.averageRating || "-"}/10
                </TableCell>
                <TableCell className="py-4 text-right">
                  {Math.floor(reviewer.totalTimeSpent / 60)} min{" "}
                  {Math.round(reviewer.totalTimeSpent % 60)} secs
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
