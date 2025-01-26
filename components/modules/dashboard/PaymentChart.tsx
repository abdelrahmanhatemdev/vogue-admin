"use client";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import React, { memo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const chartData = [
  { month: "January", thisMonth: 150, average: 100 },
  { month: "February", thisMonth: 239, average: 120 },
  { month: "March", thisMonth: 137, average: 150 },
  { month: "April", thisMonth: 116, average: 180 },
  { month: "May", thisMonth: 229, average: 200 },
  { month: "June", thisMonth: 50, average: 499 },
  { month: "July", thisMonth: 53, average: 50 },
  { month: "August", thisMonth: 252, average: 100 },
  { month: "Sebtmber", thisMonth: 179, average: 200 },
  { month: "Octuber", thisMonth: 294, average: 222 },
  { month: "November", thisMonth: 120, average: 210 },
  { month: "December", thisMonth: 441, average: 300 },
  { month: "January", thisMonth: 310, average: 50 },
  { month: "February", thisMonth: 280, average: 190 },
  { month: "March", thisMonth: 200, average: 300 },
  { month: "April", thisMonth: 300, average: 400 },
  { month: "May", thisMonth: 130, average: 200 },
  { month: "June", thisMonth: 200, average: 50 },
  { month: "July", thisMonth: 30, average: 100 },
  { month: "August", thisMonth: 170, average: 100 },
];

const chartConfig = {
  thisMonth: {
    label: "thisMonth",
    color: "#555555",
  },
  average: {
    label: "average",
    color: "#888888",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload: { dataKey: string; value: number }[];
  label: string | number;
}) => {
  if (!active || !payload || payload.length === 0 || typeof label !== "number") return null;

  return (
    <div className="rounded-md dark:bg-neutral-900 bg-neutral-100 border border-neutral-200 dark:border-neutral-950 p-2 shadow-md">
      <p className="text-sm dark:text-white text-black font-bold">Average</p>
      {payload.map((item: {dataKey: string; value: number }, index: number) => {
        const dataName =
          item.dataKey === "thisMonth" ? chartData[label].month : "Average";

        const color =
          item.dataKey === "thisMonth" ? chartConfig.thisMonth.color : chartConfig.average.color;
        return (
          <div
            key={index}
            className="text-xs dark:text-gray-200 text-gray-800 flex gap-1 items-center"
          >
            <span className="w-3 h-3 rounded" style={{background: color}}></span>
            <span>{`${dataName}: ${item.value}`}</span>
          </div>
        );
      })}
    </div>
  );
};

const PaymentChart = ({title, description}: {title: string; description: string}) => {
  const [data] = useState(chartData);

  return (
    <div className="flex flex-col items-center gap-4 dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg shadow-md lg:w-[calc(100%-19rem-2px)] w-full">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-neutral-500 text-sm">
            {description}
          </p>
        </div>
        <ChartContainer config={chartConfig} className="min-h-16 w-full h-48">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="1"
                type="natural"
                dataKey="thisMonth"
                label="This Month"
                stroke="var(--color-thisMonth)"
                animationDuration={300}
              />
              <Line
                yAxisId="2"
                type="natural"
                dataKey="average"
                stroke="var(--color-average)"
                label="Average"
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default memo(PaymentChart);
