import { memo } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";

const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);

const PaymentChart = dynamic(
  () => import("@/components/modules/colors/dashboard/PaymentChart"),
  { loading: Loading }
);

const StatsSquares = dynamic(
  () => import("@/components/modules/colors/dashboard/StatsSquares"),
  { loading: Loading }
);

const Goal = dynamic(() => import("@/components/modules/colors/dashboard/Goal"), {
  loading: Loading,
});

const GoalCalender = dynamic(() => import("@/components/modules/colors/dashboard/GoalCalender"), {
  loading: Loading,
});

function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="" />
      <div className="rounded-lg p-8 bg-background space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          <StatsSquares />
          <Goal />
        </div>
        <div className="flex flex-wrap gap-4 rounded-lg">
          <PaymentChart />
          <GoalCalender/>
        </div>
      </div>
    </div>
  );
}

export default memo(Dashboard);
