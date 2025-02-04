import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Eye, MapPin, ScrollText } from "lucide-react";

const ReviewGuidelines = () => {
  return (
    <Card className="xl:w-2/3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="h-5 w-5" />
          Review Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <p className="flex items-center gap-2 text-sm text-destructive">
            <Clock className="h-4 w-4" />
            Your review time is being recorded to ensure thorough evaluation
          </p>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            Review Process
          </h3>
          <p className="text-muted-foreground">
            Review applications thoroughly and fairly. Each application requires
            five independent reviews before a decision can be made.
          </p>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <Eye className="h-4 w-4" />
            Bias Prevention
          </h3>
          <p className="text-muted-foreground">
            Certain identifying information has been hidden during the review
            process to eliminate potential bias. This ensures fair evaluation
            based solely on merit and potential.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Rating Criteria</h3>
          <ul className="mt-2 list-inside space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0" />
              <span>
                Prioritize applicants from the Waterloo region and surrounding
                areas, as their proximity increases likelihood of attendance and
                participation.
              </span>
            </li>
            <li>
              Consider technical experience, project history, and enthusiasm to
              learn.
            </li>
            <li>
              Having answered both short answer questions should not result in a
              higher score - rate based on the quality of response(s), not
              quantity.
            </li>
            <li>
              Evaluate potential contribution and engagement with the hackathon
              community.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewGuidelines;
