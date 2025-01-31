import { getCurrentUser } from "@/auth";
import Container from "@/components/Container";
import EmergencyContactInfo from "@/components/EmergencyContactInfo";
import HackerApplicationStatus from "@/components/HackerApplicationStatus";
import HackerInfo from "@/components/ApplicationInfo";
import PageBanner from "@/components/PageBanner";
import { getApplicationWithUserById } from "@/data/applications";
import { redirect } from "next/navigation";
import ApplicationActions from "@/components/ApplicationActions";

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

  if (!currentUser || currentUser.role !== "admin") {
    redirect("https://app.hackcanada.org/login");
  }

  const userWithHackerApplication = await getApplicationWithUserById(id);
  if (!userWithHackerApplication) {
    return null;
  }

  const { hackerApplication: hacker, user: hackerUser } =
    userWithHackerApplication;

  return (
    <Container className="space-y-6 md:space-y-8">
      <PageBanner
        name={hacker?.firstName || "Hacker (no name)"}
        subheading={`More information on a particular hacker. Whether they have been accepted or not, they are considered a hacker (either accepted or rejected) because they have applied for the hackathon.`}
        backButton
      />

      <div className="flex space-y-6 max-xl:flex-col md:space-y-8 xl:space-x-8 xl:space-y-0">
        {hacker ? (
          <>
            <div className="flex max-w-4xl flex-col space-y-6 md:space-y-8">
              <HackerApplicationStatus
                status={hackerUser.applicationStatus as ApplicationStatus}
              />
              <HackerInfo hacker={hacker} />
              {/* <EmergencyContactInfo userId={hacker.userId} /> */}
            </div>
            <ApplicationActions
              hacker={hacker}
              status={hackerUser.applicationStatus as ApplicationStatus}
            />
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
