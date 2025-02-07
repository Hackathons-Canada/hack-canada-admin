import { cn } from "@/lib/utils";

type Props = {
  label: string;
  count: number;
  className?: string;
  isDecimal?: boolean;
};

const CountCard = ({ count, label, className, isDecimal }: Props) => {
  return (
    <div
      className={cn(
        "rounded-lg border py-8 text-center md:py-12 xl:py-16",
        className,
      )}
    >
      <p className="text-sm font-semibold md:text-base xl:text-lg">{label}</p>
      <p className="text-xl text-foreground md:text-2xl xl:text-3xl">{count}</p>
    </div>
  );
};

export default CountCard;
