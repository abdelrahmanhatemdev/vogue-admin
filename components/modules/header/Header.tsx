import ContentContainer from "@/components/custom/ContentContainer";
import IconsGroup from "./IconsGroup";
import Row from "@/components/custom/Row";

export default function Header() {
  return (
    <header className="p-2">
      <ContentContainer>
        <Row className="justify-end">
          <IconsGroup />
        </Row>
      </ContentContainer>
    </header>
  );
}
