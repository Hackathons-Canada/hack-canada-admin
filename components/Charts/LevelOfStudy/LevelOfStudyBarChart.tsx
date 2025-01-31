"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useState } from "react";

const chartConfig = {
  applicants: {
    label: "Applicants",
  },
} satisfies ChartConfig;

type Props = {
  data: {
    level: string | null;
    applicants: number;
  }[];
};

export default function LevelOfStudyBarChart({ data }: Props) {
  const [listView, setListView] = useState(false);

  data.sort((a, b) => b.applicants - a.applicants);

  return (
    <>
      <div className="flex justify-between max-sm:flex-col max-sm:justify-normal">
        <div>
          <p className="mb-1 text-xl font-semibold text-foreground md:text-2xl">
            Level Of Study
          </p>
          {/* from and to date */}
          <p className="text-xs md:text-sm">
            July 12, 2024 -{" "}
            {new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(
              new Date(),
            )}
          </p>
        </div>
        <div className="mt-2 flex h-fit w-fit items-center gap-1 rounded-lg border bg-secondary p-0.5 max-sm:text-sm">
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
      </div>
      {listView ? (
        <div className="mt-4 flex flex-col divide-y-2 md:mt-8">
          {data.map(({ level, applicants }) => (
            <div
              key={level}
              className="flex justify-between gap-x-2.5 py-2 max-sm:text-sm"
            >
              <p>{level}</p>
              <p>{applicants}</p>
            </div>
          ))}
        </div>
      ) : (
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="applicants"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  // hideLabel
                  nameKey="level"
                  labelFormatter={(value, props) => {
                    return [`${props[0].payload.applicants} Applicants`];
                  }} // THIS IS WHERE I NEED HELP
                  formatter={(value, name, props) => {
                    return [`${props.payload.level}`];
                  }}
                />
              }
            />
            <Bar
              dataKey="applicants"
              layout="vertical"
              fill="hsl(var(--chart-2))"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
}
