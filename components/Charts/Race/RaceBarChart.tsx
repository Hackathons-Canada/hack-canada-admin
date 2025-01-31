"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type Props = {
  data: {
    race: string | null;
    count: number;
  }[];
};

const RaceBarChart = ({ data }: Props) => {
  const [listView, setListView] = useState(false);

  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <>
      <div className="space-y-6 rounded-lg border p-6 md:p-10">
        <div className="flex justify-between max-sm:flex-col max-sm:justify-normal">
          {/* Title and Date Range */}
          <div>
            <p className="mb-1 text-xl font-semibold text-foreground md:text-2xl">
              Race / Ethnicity
            </p>
            <p className="text-xs md:text-sm">
              July 12, 2024 -{" "}
              {new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(
                new Date(),
              )}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="mx-auto mt-2 flex h-fit w-fit items-center gap-1 rounded-lg border bg-secondary p-0.5 text-sm">
              <button
                aria-label="Show Graph View"
                onClick={() => setListView(false)}
                className={cn("rounded-md px-3 py-1 transition-colors", {
                  "bg-background text-foreground": listView === false,
                })}
              >
                Graph
              </button>
              <button
                aria-label="Show List View"
                onClick={() => setListView(true)}
                className={cn("rounded-md px-3 py-1 transition-colors", {
                  "bg-background text-foreground": listView === true,
                })}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* List or Chart View */}
        {listView ? (
          <div className="flex flex-col divide-y-2">
            {sortedData.map(({ race, count }) => (
              <div
                key={race}
                className="flex justify-between gap-x-2.5 py-2 max-sm:text-sm"
              >
                <p title={`Race: ${race}`}>{race}</p>
                <p title={`Count: ${count}`}>{count}</p>
              </div>
            ))}
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%">
              <BarChart
                data={sortedData}
                layout="vertical"
                margin={{
                  left: 10,
                }}
              >
                <XAxis
                  type="number"
                  dataKey="count"
                  tick={{ fill: "var(--foreground)" }}
                  axisLine={{ stroke: "var(--foreground)" }}
                />
                <YAxis
                  dataKey="race"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: "var(--foreground)" }}
                  tickFormatter={(v) =>
                    v.slice(0, 6) + (v.length > 6 ? "..." : "")
                  }
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                  content={
                    <ChartTooltipContent
                      nameKey="race"
                      labelFormatter={(v) => v}
                    />
                  }
                />
                <Bar
                  dataKey="count"
                  fill={chartConfig.count.color}
                  radius={5}
                  animationBegin={0}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </>
  );
};

export default RaceBarChart;
