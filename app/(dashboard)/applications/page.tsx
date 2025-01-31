import Container from "@/components/Container";
import DownloadOptions from "@/components/DownloadOptions";
import PageBanner from "@/components/PageBanner";
import {
  getApplicationsSearch,
  getNumApplicationsSearch,
} from "@/data/applications";
import PaginationControls from "@/components/PaginationControls";
import { RESULTS_PER_PAGE } from "@/lib/constants";
import HackerList from "@/components/ApplicationList";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";
import { ApplicationSearch } from "@/components/search/ApplicationSearch";

interface ApplicationsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ApplicationsPage = async ({ searchParams }: ApplicationsPageProps) => {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("https://app.hackcanada.org");
  }

  // Convert string[] params to string
  const getParamAsString = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) return param[0];
    return param || "";
  };

  const page = searchParams["page"] ?? "1";
  const perPage = searchParams["perPage"] ?? RESULTS_PER_PAGE;
  const firstName = getParamAsString(searchParams["firstName"]);
  const lastName = getParamAsString(searchParams["lastName"]);
  const school = getParamAsString(searchParams["school"]);
  const levelOfStudy = getParamAsString(searchParams["levelOfStudy"]) || "all";
  const major = getParamAsString(searchParams["major"]);
  const status = getParamAsString(searchParams["status"]) || "all";

  const params = new URLSearchParams();
  params.append("firstName", firstName);
  params.append("lastName", lastName);
  params.append("school", school);
  params.append("levelOfStudy", levelOfStudy);
  params.append("major", major);
  params.append("status", status);

  const start = (Number(page) - 1) * Number(perPage);

  const [totalResultApplications, applications] = await Promise.all([
    getNumApplicationsSearch(
      firstName,
      lastName,
      school,
      levelOfStudy,
      major,
      status,
    ) ?? 0,
    getApplicationsSearch(
      firstName,
      lastName,
      school,
      levelOfStudy,
      major,
      status,
      start,
    ),
  ]);

  return (
    <Container className="space-y-10">
      <PageBanner
        subheading="A list of all the applications in the database. Or more specifically, all the applications that have been submitted, whether they have been accepted or not."
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <div className="space-y-10">
        <section aria-label="Search and Download Controls">
          <div className="flex items-start justify-between gap-8 max-2xl:flex-col-reverse">
            <div className="w-full flex-1">
              <ApplicationSearch />
            </div>
            <div className="w-full shrink-0 lg:w-auto">
              <DownloadOptions entity="applications" />
            </div>
          </div>
        </section>

        <section aria-label="Applications List" className="space-y-6">
          {applications && (
            <>
              {applications.length ? (
                <p className="text-sm font-medium text-muted-foreground max-md:text-center">
                  Displaying applications {start + 1} -{" "}
                  {start + applications.length} from{" "}
                  <span className="text-foreground">
                    {totalResultApplications}
                  </span>{" "}
                  applications
                </p>
              ) : (
                <p className="text-sm font-medium text-muted-foreground max-md:text-center">
                  No applications match the search criteria.
                </p>
              )}

              <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
                <HackerList applications={applications} />
              </div>

              {applications.length > 0 && (
                <PaginationControls
                  totalNumOfUsers={totalResultApplications}
                  search={params.toString()}
                  table="applications"
                  className="mx-auto mt-8 max-w-lg rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-md"
                />
              )}
            </>
          )}
        </section>
      </div>
    </Container>
  );
};

export default ApplicationsPage;
