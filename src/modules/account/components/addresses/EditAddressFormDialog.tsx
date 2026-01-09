import { Button } from "@/components/ui/button";
import useToggleState from "@/lib/hooks/use-toggle-state";
import type { StoreCustomerAddress, StoreRegion } from "@medusajs/types";
import { Edit, Trash } from "lucide-react";
import AddressFormDialog from "./AddressFormDialog";
import { deleteCustomerAddress, retrieveCustomer } from "@/lib/data/customer";
import { useState } from "react";
import { customerNS } from "@/nanostores/customerStore";
import { Spinner } from "@/components/ui/spinner";

const EditAddressFormDialog = ({
  region,
  address,
}: {
  region: StoreRegion;
  address: StoreCustomerAddress;
}) => {
  const { state, open, close, toggle } = useToggleState(false);
  const [removing, setRemoving] = useState(false);

  const removeAddress = async () => {
    try {
      setRemoving(true);
      await deleteCustomerAddress(address.id);
      const customer = await retrieveCustomer();
      customerNS.set(customer);
    } catch {
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <div
        className={
          "border rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between transition-colors"
        }
      >
        <div className="flex flex-col">
          <p>
            {address?.first_name} {address.last_name}
          </p>
          {address?.company && <p className="text-sm">{address?.company}</p>}
          <p className="flex flex-col text-left mt-2 text-sm">
            <span>{address.address_1}</span>
            <span>
              {address.postal_code}, {address.city}
            </span>
            <span>
              {address.province && `${address.province}, `}{" "}
              {address?.country_code?.toUpperCase()}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button size="sm" variant="outline" onClick={toggle}>
            <Edit /> Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={removeAddress}
            disabled={removing}
          >
            {removing ? <Spinner /> : <Trash />}
            Remove
          </Button>
        </div>
      </div>

      <AddressFormDialog
        state={state}
        onOpenChange={toggle}
        region={region}
        address={address}
      />
    </>
  );
};

export default EditAddressFormDialog;
