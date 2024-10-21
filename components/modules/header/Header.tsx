import IconsGroup from "./IconsGroup";
import Row from "@/components/custom/Row";

export default function Header() {
  return (
    <header className="p-2">
      <Row className="justify-end">
        <IconsGroup />
      </Row>
    </header>
  );
}
