interface LogsStatsProps {
  totalLogs: number;
  displayedLogs: number;
  start: number;
}

export function LogsStats({ totalLogs, displayedLogs, start }: LogsStatsProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Activity Log</h2>
        <p className="text-sm text-muted-foreground">
          Showing {start + 1}-{start + displayedLogs} of {totalLogs} activities
        </p>
      </div>
    </div>
  );
}
