import { RESULTS_PER_PAGE } from "@/lib/constants";
import { getAuditLogs, getNumAuditLogs } from "@/lib/db/queries/audit-log";
import { type AuditLog } from "@/lib/db/schema";

interface GetLogsProps {
  page?: string;
  perPage?: string;
  search?: string;
}

export const getLogs = async ({
  page = "1",
  perPage = RESULTS_PER_PAGE.toString(),
  search = "",
}: GetLogsProps = {}) => {
  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);

  const params = new URLSearchParams();
  params.append("search", search);

  const totalLogs = await getNumAuditLogs();
  const logs = (await getAuditLogs(Number(perPage), start)) as AuditLog[];

  return {
    logs,
    totalLogs,
    start,
    params: params.toString(),
  };
};
