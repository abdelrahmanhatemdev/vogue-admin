import { Switch } from "@/components/ui/switch";
import { notify } from "@/lib/utils";

const SwitcherButton = ({
  isProtected,
  onCheckedChange,
  checked,
}: {
  isProtected?: boolean;
  checked: boolean;
  onCheckedChange: () => void;
}) => {
  return isProtected ? (
    <Switch
      checked={false}
      onCheckedChange={() => {
        notify({ status: "500", message: "Protected item" });
      }}
      className="opacity-30"
    />
  ) : (
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  );
};
export default SwitcherButton;
