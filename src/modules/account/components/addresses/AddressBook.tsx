import type { HttpTypes } from "@medusajs/types";
import AddAddress from "./AddAddress";
import { customerNS } from "@/nanostores/customerStore";
import { useStore } from "@nanostores/react";
import EditAddressFormDialog from "./EditAddressFormDialog";

const AddressBook = ({ region }: { region: HttpTypes.StoreRegion }) => {
  const customer = useStore(customerNS);
  return (
    <>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
          <AddAddress region={region} />
          {customer?.addresses?.map((address) => (
            <EditAddressFormDialog region={region} address={address} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AddressBook;
