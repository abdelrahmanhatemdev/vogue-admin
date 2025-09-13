"use client";
import { memo, useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { browser: "Orange", orders: 275, fill: "var(--color-chrome)" },
  { browser: "Green", orders: 200, fill: "var(--color-safari)" },
  { browser: "Off Green", orders: 287, fill: "var(--color-firefox)" },
  { browser: "Yellow", orders: 173, fill: "var(--color-edge)" },
  { browser: "Brown", orders: 190, fill: "#855530" },
];
const chartConfig = {
  orders: {
    label: "Orders",
  },
  chrome: {
    label: "Orange",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Green",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Off Green",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Brown",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const DetailsSquares = () => {
  const totalorders = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.orders, 0);
  }, []);

  function getMonthName(date: Date) {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
    const thisMonth = date.getMonth();
    return formatter.format(thisMonth);
  }

  const year = new Date().getFullYear();
  return (
    <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col p-4 pt-0 shadow-md">
      <div className="">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] p-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="orders"
              nameKey="browser"
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
                          {totalorders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {/* {sold} */}
                          Orders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div className="flex flex-col text-sm p-0 w-full items-center">
      <h3 className="font-semibold text-lg">Sold Orders By Colors</h3>
        <span className="text-neutral-500 dark:text-neutral-00">
          {getMonthName(new Date()) === "January" ? "" : " - "}
          {getMonthName(new Date())} {year}
        </span>
      </div>
    </div>
  );
};

export default memo(DetailsSquares);
