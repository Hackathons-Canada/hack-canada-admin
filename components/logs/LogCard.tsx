import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ActionBadge } from "./ActionBadge";
import { User } from "@/lib/db/schema";
import Link from "next/link";

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
  // Function to render entity ID with optional link
  const renderEntityId = () => {
    if (entityType === "hackerApplication") {
      return (
        <Link
          href={`/applications/${entityId}`}
          className="text-sm text-primary hover:underline"
        >
          ID: {entityId}
        </Link>
      );
    }
    if (entityType === "user") {
      return (
        <Link
          href={`/users/${entityId}`}
          className="text-sm text-primary hover:underline"
        >
          ID: {entityId}
        </Link>
      );
    }
    return <p className="text-sm text-muted-foreground">ID: {entityId}</p>;
  };

  return (
    <Card className="overflow-hidden bg-card shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              {formatDate(createdAt)}
            </span>
            {user && (
              <span className="text-xs text-muted-foreground">
                by{" "}
                <Link href={`/users/${user.id}`} className="hover:underline">
                  {user.name}
                </Link>{" "}
                ({user.email})
              </span>
            )}
          </div>
          <ActionBadge action={action} />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold">
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </h3>
          {renderEntityId()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-0">
        {(previousValue || newValue) && (
          <div className="space-y-3 rounded-lg border bg-card/50 p-3">
            {previousValue && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Previous Value:
                </p>
                <pre className="max-h-24 overflow-auto rounded-lg bg-muted p-2.5 text-xs">
                  {JSON.stringify(JSON.parse(previousValue), null, 2)}
                </pre>
              </div>
            )}
            {newValue && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  New Value:
                </p>
                <pre className="max-h-24 overflow-auto rounded-lg bg-muted p-2.5 text-xs">
                  {JSON.stringify(JSON.parse(newValue), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {metadata && (
          <div className="rounded-lg border bg-card/50 p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Additional Context:
            </p>
            <pre className="max-h-40 overflow-auto rounded-lg bg-muted p-2.5 text-xs">
              {JSON.stringify(JSON.parse(metadata), null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
