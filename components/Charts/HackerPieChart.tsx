"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  applicants: {
    label: "Applicants",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  accepted: {
    label: "Accepted",
    color: "hsl(var(--chart-2))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-3))",
  },
  waitlisted: {
    label: "WaitListed",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type Props = {
  applicantsCount: number;
  data: any[];
};

const HackerPieChart = ({ applicantsCount, data }: Props) => {
  return (
    <div className="w-full rounded-lg border p-6 sm:h-fit md:p-10">
      <p className="mb-1 text-center text-xl font-semibold text-foreground md:text-2xl">
        Application Statuses
      </p>
      {/* from and to date */}
      <p className="text-center text-xs md:text-sm">
        July 12, 2024 -{" "}
        {new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(
          new Date(),
        )}
      </p>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={data}
            dataKey="applicants"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {applicantsCount.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Applicants
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <p className="text-balance text-center text-xs md:text-sm">
        List of all applicants categorized by their current application status.
      </p>
    </div>
  );
};
export default HackerPieChart;
