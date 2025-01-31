import { cn } from "@/lib/utils";

const InfoRow = ({
  label,
  value,
  className,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) => {
  // Check if value is a simple text content (string or number)
  const isTextContent = typeof value === "string" || typeof value === "number";

  return (
    <div className="flex flex-col gap-2 rounded-lg px-2.5 py-3.5 transition-colors hover:bg-foreground/5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:gap-8">
      <div className="flex items-center gap-3 sm:w-1/2">
        <span className="text-muted-foreground">{icon}</span>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      {isTextContent ? (
        <p
          className={cn(
            "break-all text-sm font-medium sm:w-1/2 sm:break-normal sm:text-right",
            className,
          )}
        >
          {value}
        </p>
      ) : (
        <div
          className={cn(
            "break-all text-sm font-medium sm:w-1/2 sm:break-normal sm:text-right",
            className,
          )}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default InfoRow;
