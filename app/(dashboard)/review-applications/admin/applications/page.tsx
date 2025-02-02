import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hackerApplications, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";

export default async function AdminApplicationsPage() {
  const user = await getCurrentUser();

  if (!user?.id || !isAdmin(user.role)) {
    redirect("/");
  }

  const applications = await db
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
    .orderBy(desc(hackerApplications.createdAt));

  return (
    <div className="container max-w-screen-xl space-y-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Submitted Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Reviews</TableHead>
                <TableHead className="text-center">Avg. Rating</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    {application.firstName} {application.lastName}
                  </TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell className="text-center">
                    {application.reviewCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {application.averageRating ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {application.internalResult}
                  </TableCell>
                  <TableCell className="text-right">
                    <ApplicationStatusModal
                      status={
                        application.applicationStatus as ApplicationStatus
                      }
                      userId={application.userId}
                      name={`${application.firstName} ${application.lastName}`}
                      email={application.email ?? ""}
                    >
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                    </ApplicationStatusModal>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
