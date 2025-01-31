import Container from "@/components/Container";
import DownloadOptions from "@/components/DownloadOptions";
import PageBanner from "@/components/PageBanner";
import { getHackersSearch, getNumHackersSearch } from "@/data/hacker";
import PaginationControls from "@/components/UsersTable/PaginationControls";
import { RESULTS_PER_PAGE } from "@/lib/constants";
import HackerList from "@/components/HackerList";
import { HackerSearch } from "@/components/HackerSearch";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";

interface HackersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const HackersPage = async ({ searchParams }: HackersPageProps) => {
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

  const [totalResultHackers, hackers] = await Promise.all([
    getNumHackersSearch(
      firstName,
      lastName,
      school,
      levelOfStudy,
      major,
      status,
    ) ?? 0,
    getHackersSearch(
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
        subheading="A list of all the hackers in the database. Or more specifically, all the applications that have been submitted, whether they have been accepted or not."
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <div className="space-y-10">
        <section aria-label="Search and Download Controls">
          <div className="flex items-start justify-between gap-8 max-2xl:flex-col-reverse">
            <div className="w-full flex-1">
              <HackerSearch />
            </div>
            <div className="w-full shrink-0 lg:w-auto">
              <DownloadOptions entity="hackers" />
            </div>
          </div>
        </section>

        <section aria-label="Hackers List" className="space-y-6">
          {hackers && (
            <>
              {hackers.length ? (
                <p className="text-sm font-medium text-muted-foreground max-md:text-center">
                  Displaying hackers {start + 1} - {start + hackers.length} from{" "}
                  <span className="text-foreground">{totalResultHackers}</span>{" "}
                  hackers
                </p>
              ) : (
                <p className="text-sm font-medium text-muted-foreground max-md:text-center">
                  No hackers match the search criteria.
                </p>
              )}

              <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
                <HackerList hackers={hackers} />
              </div>

              {hackers.length > 0 && (
                <PaginationControls
                  totalNumOfUsers={totalResultHackers}
                  search={params.toString()}
                  table="hackers"
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

export default HackersPage;
