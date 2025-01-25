import { memo } from "react";
import { ImArrowUp, ImArrowDown } from "react-icons/im";

const StatsSquares = () => {
  return (
    <div className="grid grid-cols-[calc(50%-.5rem)_calc(50%-.5rem)] gap-4">
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div className="flex flex-col">
          <h4 className="font-extralight">Customers</h4>
          <p className="font-bold">55,350</p>
        </div>
        <div className="flex flex-col justify-center text-xs">
          <div className="flex gap-1 text-green-400  items-center">
            <ImArrowUp size={10} />
            <span>5.25%</span>
          </div>
          <span className="text-neutral-500">Since Last Month</span>
        </div>
      </div>
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div className="flex flex-col">
          <h4 className="font-extralight">Orders</h4>
          <p className="font-bold">12,520</p>
        </div>
        <div className="flex flex-col justify-center text-xs">
          <div className="flex gap-1 text-red-600 items-center">
            <ImArrowDown size={10} />
            <span>1.13%</span>
          </div>
          <span className="text-neutral-500">Since Last Month</span>
        </div>
      </div>
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div className="flex flex-col">
          <h4 className="font-extralight">Earnings</h4>
          <p className="font-bold">$8,540</p>
        </div>
        <div className="flex flex-col justify-center text-xs">
          <div className="flex gap-1 text-red-600 items-center">
            <ImArrowDown size={10} />
            <span>3.73%</span>
          </div>
          <span className="text-neutral-500">Since Last Month</span>
        </div>
      </div>
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div className="flex flex-col">
          <h4 className="font-extralight">Growth</h4>
          <p className="font-bold">+20.30%</p>
        </div>
        <div className="flex flex-col justify-center text-xs">
          <div className="flex gap-1 text-green-400  items-center">
            <ImArrowUp size={10} />
            <span>4.25%</span>
          </div>
          <span className="text-neutral-500">Since Last Month</span>
        </div>
      </div>
    </div>
  );
};
export default memo(StatsSquares);
