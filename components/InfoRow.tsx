import { cn } from "@/lib/utils";

type InfoRowProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  longAnswer?: boolean;
};

const InfoRow = ({
  label,
  value,
  className,
  icon,
  longAnswer,
}: InfoRowProps) => {
  const isTextContent = typeof value === "string" || typeof value === "number";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg px-2.5 py-3.5 transition-colors hover:bg-foreground/5 sm:gap-4",
        longAnswer
          ? ""
          : "sm:flex-row sm:items-center sm:justify-between md:gap-8",
      )}
    >
      <div
        className={`flex items-center gap-3 ${longAnswer ? "" : "sm:w-1/2"}`}
      >
        <span className="text-muted-foreground">{icon}</span>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      {isTextContent ? (
        <p
          className={cn(
            "text-sm font-medium",
            className,
            longAnswer
              ? "text-base font-normal md:text-lg"
              : "break-all sm:w-1/2 sm:break-normal sm:text-right",
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
