import { getAuditLogs } from "@/lib/db/queries/audit-log";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import PaginationControls from "@/components/PaginationControls";
import { db } from "@/lib/db";
import { RESULTS_PER_PAGE } from "@/lib/constants";
import { LogsStats } from "@/components/logs/LogsStats";
import { LogList } from "@/components/logs/LogList";

async function LogsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = RESULTS_PER_PAGE;
  const offset = (currentPage - 1) * pageSize;
  const search = searchParams.search || "";

  const logs = await getAuditLogs(pageSize, offset);

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
    <Container className="space-y-10">
      <PageBanner
        heading="Audit Logs"
        subheading="A detailed record of all system actions and changes."
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <main className="space-y-10">
        <section aria-label="Audit Logs List" className="space-y-6">
          <LogsStats totalLogs={logs.length} displayedLogs={logs.length} />

          <LogList logs={logs} userMap={userMap} />

          {logs.length > 0 && (
            <PaginationControls
              totalNumOfUsers={logs.length}
              search={search}
              table="/logs"
              className="mx-auto mt-8 max-w-lg rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-md"
            />
          )}
        </section>
      </main>
    </Container>
  );
}

export default LogsPage;
