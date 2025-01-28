"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

type Props = {
  data: {
    gender: string;
    count: number;
  }[];
};

const GenderBarChart = ({ data }: Props) => {
  const [listView, setListView] = useState(false);
  data.sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 rounded-lg border p-6 md:p-10">
      <div className="">
        <p className="mb-1 text-center text-xl font-semibold text-foreground md:text-2xl">
          Gender
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
          {data.map(({ gender, count }) => (
            <div
              key={gender}
              className="flex justify-between gap-x-2.5 py-2 max-sm:text-sm"
            >
              <p>{gender}</p>
              <p>{count}</p>
            </div>
          ))}
        </div>
      ) : (
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="gender"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={5} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};
export default GenderBarChart;
