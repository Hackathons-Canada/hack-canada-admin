import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewerStatsCardsProps {
  reviewCount: number;
  timeSpent: string;
  averageRating: number;
}

export default function ReviewerStatsCards({
  reviewCount,
  timeSpent,
  averageRating,
}: ReviewerStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Total Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{reviewCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Time Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{timeSpent}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Average Rating Given</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{averageRating}</p>
        </CardContent>
      </Card>
    </div>
  );
}
