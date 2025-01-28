"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Cell, Pie, PieChart } from "recharts";

const chartConfig = {
  count: {
    label: "Count",
  },
  xs: {
    label: "XS (Extra Small)",
    color: "pink",
  },
  s: {
    label: "S (Small)",
    color: "hsl(var(--chart-2))",
  },
  m: {
    label: "M (Medium)",
    color: "hsl(var(--chart-3))",
  },
  l: {
    label: "L (Large)",
    color: "hsl(var(--chart-4))",
  },
  xl: {
    label: "XL (Extra Large)",
    color: "hsl(var(--chart-5))",
  },
  xxl: {
    label: "XXL (2X Large)",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

type Props = {
  data: {
    tShirtSize: string;
    count: number;
  }[];
};

const TShirtPieChart = ({ data }: Props) => {
  const [listView, setListView] = useState(false);

  const chartData = data.map((d, i) => ({
    ...d,
    color: colors[i],
  }));

  return (
    <div className="space-y-6 rounded-lg border p-6 md:p-10">
      <div className="">
        <p className="mb-1 text-center text-xl font-semibold text-foreground md:text-2xl">
          T-Shirt Sizes
        </p>
        {/* from and to date */}
        <p className="text-center text-xs md:text-sm">
          July 12, 2024 -{" "}
          {new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(
            new Date(),
          )}
        </p>
      </div>

      <div className="mx-auto mt-2 flex h-fit w-fit items-center gap-1 rounded-lg border bg-secondary p-0.5 text-sm">
        <button
          onClick={() => setListView(false)}
          className={cn("rounded-md px-3 py-1 transition-colors", {
            "bg-background text-foreground": listView === false,
          })}
        >
          Graph
        </button>

        <button
          onClick={() => setListView(true)}
          className={cn("rounded-md px-3 py-1 transition-colors", {
            "bg-background text-foreground": listView === true,
          })}
        >
          List
        </button>
      </div>

      {listView ? (
        <div className="flex flex-col divide-y-2">
          {data.map(({ tShirtSize, count }) => (
            <div
              key={tShirtSize}
              className="flex justify-between gap-x-2.5 py-2 max-sm:text-sm"
            >
              <p>{tShirtSize}</p>
              <p>{count}</p>
            </div>
          ))}
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" label nameKey="tShirtSize">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
};
export default TShirtPieChart;
