import { getCurrentUser } from "@/auth";
import Container from "@/components/Container";
import HackerApplicationStatus from "@/components/HackerApplicationStatus";
import HackerInfo from "@/components/ApplicationInfo";
import PageBanner from "@/components/PageBanner";
import {
  getApplicationWithUserById,
  getApplicationReviews,
} from "@/data/applications";
import { redirect } from "next/navigation";
import ApplicationActions from "@/components/ApplicationActions";
import { isAdmin } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const HackerPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { id } = params;
  const user = await getCurrentUser();
  const currentUser = user;

  if (!currentUser || !isAdmin(currentUser.role)) {
    redirect("https://app.hackcanada.org/login");
  }

  const userWithHackerApplication = await getApplicationWithUserById(id);
  if (!userWithHackerApplication) {
    console.log("No user with id: " + id);
    return null;
  }

  const { hackerApplication: hacker, user: hackerUser } =
    userWithHackerApplication;

  const reviews = await getApplicationReviews(hacker.id);

  return (
    <Container className="space-y-6 md:space-y-8">
      <PageBanner
        name={hacker?.firstName || "Hacker (no name)"}
        subheading={`More information on a particular hacker's application.`}
        backButton
      />

      <div className="flex space-y-6 max-xl:flex-col md:space-y-8 xl:space-x-8 xl:space-y-0">
        {hacker ? (
          <>
            <div className="flex w-full flex-col space-y-6 max-2xl:max-w-4xl md:space-y-8 2xl:w-2/3">
              <HackerApplicationStatus
                status={hackerUser.applicationStatus as ApplicationStatus}
              />
              <HackerInfo hacker={hacker} />
            </div>
            <div className="flex w-full flex-col gap-6 md:gap-8 xl:w-1/3">
              <div className="rounded-md border">
                <div className="border-b bg-muted/75 p-4">
                  <h2 className="font-semibold">Application Reviews</h2>
                  <p className="text-sm text-muted-foreground">
                    {reviews?.length || 0} review
                    {reviews?.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="divide-y">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                      >
                        <Link
                          href={`/users/${review.reviewerId}`}
                          className="flex items-center gap-1.5"
                        >
                          <p className="font-medium">
                            {review.reviewerName.split(" ")[0]}
                          </p>
                          <ExternalLink strokeWidth={2.5} size={16} />
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                            {review.rating}/10
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">
                      No reviews yet
                    </p>
                  )}
                </div>
              </div>
              <ApplicationActions
                hacker={hacker}
                status={hackerUser.applicationStatus as ApplicationStatus}
              />
            </div>
          </>
        ) : (
          <p className="rounded-lg border p-4 md:p-8">
            Hacker with the ID of &ldquo;{id}&quot; does not exist in our
            records.
          </p>
        )}
      </div>
    </Container>
  );
};

export default HackerPage;
