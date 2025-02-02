import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/utils";
import { hackerApplications, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import AdminApplicationList from "@/components/review/AdminApplicationList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaginationControls from "@/components/PaginationControls";
import { RESULTS_PER_PAGE } from "@/lib/constants";
import { count } from "drizzle-orm";

interface AdminApplicationsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminApplicationsPage({
  searchParams,
}: AdminApplicationsPageProps) {
  const user = await getCurrentUser();

  if (!user?.id || !isAdmin(user.role)) {
    redirect("/");
  }

  const page = Number(searchParams["page"] ?? "1");
  const perPage = Number(searchParams["perPage"] ?? RESULTS_PER_PAGE);
  const start = (page - 1) * perPage;

  const [totalApplications, applications] = await Promise.all([
    db
      .select({ count: count() })
      .from(hackerApplications)
      .where(eq(hackerApplications.submissionStatus, "submitted"))
      .then((result) => result[0].count),
    db
      .select({
        id: hackerApplications.id,
        firstName: hackerApplications.firstName,
        lastName: hackerApplications.lastName,
        email: hackerApplications.email,
        reviewCount: hackerApplications.reviewCount,
        averageRating: hackerApplications.averageRating,
        internalResult: hackerApplications.internalResult,
        userId: hackerApplications.userId,
        applicationStatus: users.applicationStatus,
      })
      .from(hackerApplications)
      .innerJoin(users, eq(users.id, hackerApplications.userId))
      .where(eq(hackerApplications.submissionStatus, "submitted"))
      .orderBy(desc(hackerApplications.createdAt))
      .limit(perPage)
      .offset(start),
  ]);

  return (
    <Container className="space-y-10">
      <PageBanner
        heading="Review Applications"
        subheading="Review and manage submitted hacker applications. View internal results and update application statuses."
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Submitted Applications</CardTitle>
          {applications.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Displaying applications {start + 1} -{" "}
              {start + applications.length} from{" "}
              <span className="font-medium">{totalApplications}</span>{" "}
              applications
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {applications.length > 0 ? (
            <>
              <AdminApplicationList applications={applications} />
              <PaginationControls
                totalNumOfUsers={totalApplications}
                table="review-applications"
                search=""
                className="mx-auto mt-8 max-w-lg rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-md"
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No applications have been submitted yet.
            </p>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
