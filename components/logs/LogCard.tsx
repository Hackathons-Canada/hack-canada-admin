import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ActionBadge } from "./ActionBadge";
import { User } from "@/lib/db/schema";

interface LogCardProps {
  id: string;
  createdAt: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue: string | null;
  newValue: string | null;
  metadata: string | null;
  user?: Pick<User, "id" | "name" | "email">;
}

export function LogCard({
  createdAt,
  action,
  entityType,
  entityId,
  previousValue,
  newValue,
  metadata,
  user,
}: LogCardProps) {
  return (
    <Card className="overflow-hidden border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">
              {formatDate(createdAt)}
            </span>
            {user && (
              <span className="text-xs text-muted-foreground">
                by {user.name} ({user.email})
              </span>
            )}
          </div>
          <ActionBadge action={action} />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium">
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </h3>
          <p className="text-sm text-muted-foreground">ID: {entityId}</p>
        </div>

        {(previousValue || newValue) && (
          <div className="space-y-3 border-t pt-4">
            {previousValue && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Previous Value:
                </p>
                <pre className="mt-1 max-h-24 overflow-auto rounded-lg bg-muted p-2 text-xs">
                  {JSON.stringify(JSON.parse(previousValue), null, 2)}
                </pre>
              </div>
            )}
            {newValue && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  New Value:
                </p>
                <pre className="mt-1 max-h-24 overflow-auto rounded-lg bg-muted p-2 text-xs">
                  {JSON.stringify(JSON.parse(newValue), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {metadata && (
          <div className="border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Additional Context:
            </p>
            <pre className="mt-1 max-h-24 overflow-auto rounded-lg bg-muted p-2 text-xs">
              {JSON.stringify(JSON.parse(metadata), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}
