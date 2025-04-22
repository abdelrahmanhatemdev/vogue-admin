import { Button } from "@/components/ui/button";
import { notify } from "@/lib/utils";
import { TbEdit, TbTrash, TbPlus } from "react-icons/tb";

type BaseButtonProps = {
  isProtected?: boolean;
  onClick: () => void;
  type: "add" | "edit" | "delete";
};

const icons = {
  add: <TbPlus size={20} />,
  edit: <TbEdit size={20} />,
  delete: <TbTrash size={20} />,
};

const labels = {
  add: "Add New",
  edit: "Edit",
  delete: "Delete",
};

const BaseButton = ({
  isProtected = false,
  onClick,
  type,
}: BaseButtonProps) => {
  const handleClick = () => {
    if (isProtected) {
      notify({ status: "500", message: "Protected item" });
      return;
    }
    onClick();
  };

  return (
    <Button
      variant={type === "delete" ? "destructive" : "default"}
      size="sm"
      className="flex items-center gap-2 cursor-pointer"
      onClick={handleClick}
    >
      <span>{labels[type]}</span>
      {icons[type]}
    </Button>
  );
};

export default BaseButton;
