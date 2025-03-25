import { notify } from "@/lib/utils";
import { TbEdit } from "react-icons/tb";
import { TbEditOff } from "react-icons/tb";

const EditButton = ({
  isProtected,
  onClick,
}: {
  isProtected: boolean;
  onClick: () => void;
}) => {
  return isProtected ? (
    <TbEditOff
      size={18}
      className="cursor-pointer opacity-60"
      onClick={() => {
        notify({status: "500", message: "Item is protected"})}}
    />
  ) : (
    <TbEdit size={18} className="cursor-pointer" onClick={onClick}/>
  );
};
export default EditButton;
