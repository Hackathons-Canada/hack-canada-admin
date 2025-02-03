import { getLogs } from "@/data/logs-page";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import PaginationControls from "@/components/PaginationControls";
import { db } from "@/lib/db";
import { LogsStats } from "@/components/logs/LogsStats";
import { LogList } from "@/components/logs/LogList";

interface LogsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const LogsPage = async ({ searchParams }: LogsPageProps) => {
  const { logs, totalLogs, start, params } = await getLogs({
    page: searchParams["page"] as string,
    perPage: searchParams["perPage"] as string,
    search: searchParams["search"] as string,
  });

  // Get user information for all unique userIds
  const uniqueUserIds = Array.from(new Set(logs.map((log) => log.userId)));
  const users = await db.query.users.findMany({
    where: (users, { inArray }) => inArray(users.id, uniqueUserIds),
    columns: {
      id: true,
      name: true,
      email: true,
    },
  });

  // Create a map for quick user lookups
  const userMap = new Map(
    users.map((user) => [
      user.id,
      { id: user.id, name: user.name, email: user.email },
    ]),
  );

  return (
    <Container className="space-y-6 md:space-y-10">
      <PageBanner
        heading="Audit Logs"
        subheading="A detailed record of all system actions and changes."
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <section aria-label="Audit Logs List" className="space-y-6 md:space-y-10">
        <LogsStats
          totalLogs={totalLogs}
          displayedLogs={logs.length}
          start={start}
        />

        <LogList logs={logs} userMap={userMap} />

        {logs.length > 0 && (
          <PaginationControls
            totalNumOfUsers={totalLogs}
            search={params}
            table="/logs"
            className="mx-auto mt-8 max-w-lg rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-md"
          />
        )}
      </section>
    </Container>
  );
};

export default LogsPage;
