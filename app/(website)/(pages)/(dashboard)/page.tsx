import { memo } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";

const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);

const StatsSquares = dynamic(
  () => import("@/modules/dashboard/StatsSquares"),
  { loading: Loading }
);

const Goal = dynamic(() => import("@/modules/dashboard/Goal"), {
  loading: Loading,
});

const PaymentChart = dynamic(
  () => import("@/modules/dashboard/PaymentChart"),
  { loading: Loading }
);

const GoalCalender = dynamic(() => import("@/modules/dashboard/GoalCalender"), {
  loading: Loading,
});



function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="" />
      <div className="md:rounded-lg md:p-8 bg-background space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          <StatsSquares />
          <Goal />
        </div>
        <div className="flex flex-wrap gap-4 rounded-lg">
          <PaymentChart title="Total Sold Orders" description="Your Marketing target are ahead of where you normally are."/>
          <GoalCalender/>
        </div>
      </div>
    </div>
  );
}

export default memo(Dashboard);
