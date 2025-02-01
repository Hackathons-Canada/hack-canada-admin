import { LogCard } from "./LogCard";
import type { AuditLog, User } from "@/lib/db/schema";

interface LogListProps {
  logs: AuditLog[];
  userMap: Map<string, Pick<User, "id" | "name" | "email">>;
}

export function LogList({ logs, userMap }: LogListProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {logs.map((log) => {
        const user = userMap.get(log.userId);
        return (
          <LogCard
            key={log.id}
            id={log.id}
            createdAt={log.createdAt.toString()}
            action={log.action}
            entityType={log.entityType}
            entityId={log.entityId}
            previousValue={log.previousValue}
            newValue={log.newValue}
            metadata={log.metadata}
            user={user}
          />
        );
      })}
    </div>
  );
}
