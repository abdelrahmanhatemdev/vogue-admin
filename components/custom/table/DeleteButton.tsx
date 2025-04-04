import { notify } from "@/lib/utils";
import { TbTrash, TbTrashOff } from "react-icons/tb";

const DeleteButton = ({
  isProtected,
  onClick,
}: {
  isProtected: boolean;
  onClick: () => void;
}) => {
  return isProtected ? (
    <TbTrashOff
      size={18}
      color="#dc2626"
      className="cursor-pointer opacity-60"
      onClick={() => {
        notify({status: "500", message: "Protected item"})}}
    />
  ) : (
    <TbTrash size={18} color="#dc2626" className="cursor-pointer" onClick={onClick}/>
  );
};
export default DeleteButton;
