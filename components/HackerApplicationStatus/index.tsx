import { formatApplicationStatus } from "@/lib/utils";

type Props = {
  status: ApplicationStatus;
};

const HackerApplicationStatus = ({ status }: Props) => {
  return (
    <div className="space-y-2.5 rounded-lg border p-6 text-center md:p-10">
      <p className="text-sm font-semibold opacity-50">Application Status</p>
      <p className="text-foreground md:text-lg">
        {formatApplicationStatus(status)}
      </p>
    </div>
  );
};
export default HackerApplicationStatus;
