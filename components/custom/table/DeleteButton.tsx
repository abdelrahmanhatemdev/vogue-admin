import { notify } from "@/lib/utils";
import { TbTrash, TbTrashOff } from "react-icons/tb";

type DeleteButtonProps = {
  isProtected?: boolean;
  onClick: () => void;
};

const DeleteButton = ({ isProtected = false, onClick }: DeleteButtonProps) => {
  const handleClick = () => {
    if (isProtected) {
      notify({ status: "500", message: "Protected item" });
      return;
    }
    onClick();
  };

  const Icon = isProtected ? TbTrashOff : TbTrash;

  return (
    <Icon
      size={18}
      color="#dc2626"
      className={`cursor-pointer ${isProtected ? "opacity-60" : ""}`}
      onClick={handleClick}
    />
  );
};

export default DeleteButton;
