"use client";
import { memo, ReactNode, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Bar, BarChart, Tooltip, TooltipProps } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

const chartData = [
  { month: "January", thisMonth: 186, average: 80 },
  { month: "February", thisMonth: 305, average: 200 },
  { month: "March", thisMonth: 237, average: 120 },
  { month: "April", thisMonth: 73, average: 190 },
  { month: "May", thisMonth: 209, average: 130 },
  { month: "June", thisMonth: 214, average: 140 },
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

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>): ReactNode => {
  if (!active || !payload || payload.length === 0) return null;

  const month = chartData[label].month

  return (
    <div className="rounded-md dark:bg-neutral-900 md:dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-950 p-2 shadow-md">
      <p className="text-sm dark:text-white text-black font-bold">{month}</p>
      {payload.map((item, index) => {
        const color =
          item.dataKey === "thisMonth"
            ? chartConfig.thisMonth.color
            : chartConfig.average.color;
        const dataName =
          item.dataKey === "thisMonth" ? month : "Average";

        return (
          <div
            key={index}
            className="text-xs dark:text-gray-200 text-gray-800 flex gap-1 items-center"
          >
            <span
              className="w-3 h-3 rounded"
              style={{ background: color }}
            ></span>
            <span>{`${dataName}: ${item.value}`}</span>
          </div>
        );
      })}
    </div>
  );
};

const Gaol = () => {
  const [goal, setGoal] = useState(250);
  return (
    <div className="flex flex-col justify-between gap-2 dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg shadow-md">
      <div className="flex flex-col">
        <h4 className="font-semibold">Marketing Goal</h4>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Set your monthly marketing goal
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex w-8 h-8 justify-center items-center rounded-full border border-neutral-600 cursor-pointer">
          <FaMinus size={15} onClick={() => setGoal((prev) => prev - 1)} />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="font-bold text-4xl">{goal}</p>
          <span className="text-xs text-neutral-400">Orders/month</span>
        </div>
        <div className="flex w-8 h-8 justify-center items-center rounded-full border border-neutral-600 cursor-pointer">
          <FaPlus size={15} onClick={() => setGoal((prev) => prev + 1)} />
        </div>
      </div>
      <ChartContainer config={chartConfig} className="min-h-16 w-full h-16">
        <BarChart accessibilityLayer data={chartData}>
          <Tooltip content={<CustomTooltip />}/>
          <Bar dataKey="thisMonth" fill="var(--color-thisMonth)" radius={4} />
          <Bar dataKey="average" fill="var(--color-average)" radius={4} />
        </BarChart>
      </ChartContainer>
      <Button variant={"secondary"}>Set Goal</Button>
    </div>
  );
};
export default memo(Gaol);
