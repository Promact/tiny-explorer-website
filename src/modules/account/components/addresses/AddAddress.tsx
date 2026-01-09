import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useToggleState from "@/lib/hooks/use-toggle-state";
import { Plus } from "lucide-react";
import AddressFormDialog from "./AddressFormDialog";
import type { HttpTypes } from "@medusajs/types";

const AddAddress = ({ region }: { region: HttpTypes.StoreRegion }) => {
  const { state, open, close, toggle } = useToggleState(false);

  return (
    <>
      <Button
        onClick={toggle}
        className="border rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between"
      >
        <span className="text-base-semi">New address</span>
        <Plus />
      </Button>

      <AddressFormDialog state={state} onOpenChange={toggle} region={region} />
    </>
  );
};

export default AddAddress;
