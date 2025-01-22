
import { memo} from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
const Heading = dynamic(() => import("@/components/custom/Heading"), {
  loading: Loading,
});
const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);


function Dashboard() {


  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="" />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
       
      </div>
    </div>
  );
}

export default memo(Dashboard);
