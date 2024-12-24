import Loading from "@/components/custom/Loading";
import dynamic from "next/dynamic";
import { memo } from "react";
const ContentContainer = dynamic(
  () => import("@/components/custom/ContentContainer"),
  { loading: Loading }
);
function Footer() {
  return (
    <footer className="flex items-center w-full">
      <ContentContainer>
        <p className="bg-background p-4 rounded-lg my-4">
          <span>2042</span> &#64; Vogue
        </p>
      </ContentContainer>
    </footer>
  );
}

export default memo(Footer);
