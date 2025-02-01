interface LogsStatsProps {
  totalLogs: number;
  displayedLogs: number;
}

export function LogsStats({ totalLogs, displayedLogs }: LogsStatsProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Activity Log</h2>
        <p className="text-sm text-muted-foreground">
          Showing {displayedLogs} recent activities
        </p>
      </div>
    </div>
  );
}
