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

  const page = searchParams["page"] ?? "1";
  const perPage = searchParams["perPage"] ?? RESULTS_PER_PAGE;
  const firstName = searchParams["firstName"] ?? "";
  const lastName = searchParams["lastName"] ?? "";
  const age = searchParams["age"] ?? "all";
  const diet = searchParams["diet"] ?? "all";
  const school = searchParams["school"] ?? "";
  const status = searchParams["status"] ?? "all";

  const params = new URLSearchParams();
  params.append("firstName", firstName.toString());
  params.append("lastName", lastName.toString());
  params.append("age", age.toString());
  params.append("diet", diet.toString());
  params.append("school", school.toString());
  params.append("status", status.toString());

  const totalResultHackers =
    (await getNumHackersSearch(
      firstName,
      lastName,
      school,
      age,
      diet,
      status,
    )) ?? 0;

  const start = (Number(page) - 1) * Number(perPage);

  const hackers = await getHackersSearch(
    firstName,
    lastName,
    school,
    age,
    diet,
    status,
    start,
  );

  return (
    <Container className="space-y-6 md:space-y-8">
      <PageBanner subheading="A list of all the hackers in the database. Or more specifically, all the applications that have been submitted, whether they have been accepted or not." />
      <DownloadOptions entity="hackers" />
      <HackerSearch />
      <div className="space-y-2">
        {hackers?.length ? (
          <div className="flex flex-col space-y-2 xl:flex-row xl:items-end xl:justify-between">
            <p className="max-md:text-center max-md:text-sm">
              Displaying hackers {start + 1} - {start + hackers.length} from{" "}
              {totalResultHackers} hackers
            </p>

            {/* <PaginationControls
              totalNumOfUsers={totalResultHackers}
              table={"hackers"}
              search={params.toString()}
              className="mt-6 max-w-lg rounded-md border bg-zinc-100 py-2.5 dark:bg-zinc-950 max-md:mx-auto md:mt-8"
            /> */}
          </div>
        ) : (
          <p className="max-md:text-center max-md:text-sm">
            No hackers match the search criteria.
          </p>
        )}

        <div className="relative mx-auto w-full overflow-x-hidden max-sm:text-center">
          {hackers ? (
            <>
              <HackerList hackers={hackers} />
            </>
          ) : (
            <div className="rounded-b-lg border-2 p-4 md:p-6">
              <p className="font-medium max-sm:text-sm">
                Could not find any hackers.
              </p>
            </div>
          )}
        </div>
        {hackers?.length ? (
          <PaginationControls
            totalNumOfUsers={totalResultHackers}
            search={params.toString()}
            table={"hackers"}
            className="max-w-lg rounded-md border bg-zinc-100 py-2.5 dark:bg-zinc-950 max-md:mx-auto md:mt-8"
          />
        ) : null}
      </div>
    </Container>
  );
};

export default HackersPage;
