import { notify } from "@/lib/utils";
import { TbEdit, TbEditOff } from "react-icons/tb";

type EditButtonProps = {
  isProtected?: boolean;
  onClick: () => void;
};

const EditButton = ({ isProtected = false, onClick }: EditButtonProps) => {
  const handleClick = () => {
    if (isProtected) {
      notify({ status: "500", message: "Protected item" });
      return;
    }
    onClick();
  };

  const Icon = isProtected ? TbEditOff : TbEdit;

  return (
    <Icon
      size={18}
      className={`cursor-pointer ${isProtected ? "opacity-60" : ""}`}
      onClick={handleClick}
    />
  );
};

export default EditButton;
