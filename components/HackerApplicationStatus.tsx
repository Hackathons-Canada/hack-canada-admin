import { formatApplicationStatus, cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  FileQuestion,
  XCircle,
  AlertCircle,
  Ban,
} from "lucide-react";

type Props = {
  status: ApplicationStatus;
};

const getStatusConfig = (status: ApplicationStatus) => {
  switch (status) {
    case "accepted":
      return {
        icon: CheckCircle2,
        bgColor: "bg-emerald-500/10 border-emerald-500/20",
        textColor: "text-emerald-500",
      };
    case "pending":
      return {
        icon: Clock,
        bgColor: "bg-yellow-500/10 border-yellow-500/20",
        textColor: "text-yellow-500",
      };
    case "not_applied":
      return {
        icon: FileQuestion,
        bgColor: "bg-blue-500/10 border-blue-500/20",
        textColor: "text-blue-500",
      };
    case "rejected":
      return {
        icon: XCircle,
        bgColor: "bg-red-500/10 border-red-500/20",
        textColor: "text-red-500",
      };
    case "waitlisted":
      return {
        icon: AlertCircle,
        bgColor: "bg-orange-500/10 border-orange-500/20",
        textColor: "text-orange-500",
      };
    case "cancelled":
      return {
        icon: Ban,
        bgColor: "bg-neutral-500/10 border-neutral-500/20",
        textColor: "text-neutral-500",
      };
    default:
      return {
        icon: FileQuestion,
        bgColor: "bg-blue-500/10 border-blue-500/20",
        textColor: "text-blue-500",
      };
  }
};

const HackerApplicationStatus = ({ status }: Props) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group relative space-y-3 rounded-lg border p-6 text-center transition-all duration-300 hover:scale-[1.01] md:p-8",
        config.bgColor,
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <Icon className={cn("size-5", config.textColor)} />
        <p className={cn("text-sm font-semibold", config.textColor)}>
          Application Status
        </p>
      </div>
      <p className="text-foreground/90 md:text-lg">
        {formatApplicationStatus(status)}
      </p>
    </div>
  );
};

export default HackerApplicationStatus;
