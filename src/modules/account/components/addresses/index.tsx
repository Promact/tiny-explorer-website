import { retrieveCustomer } from "@/lib/data/customer";
import { getRegion } from "@/lib/data/region";
import type { HttpTypes, StoreCustomer } from "@medusajs/types";
import { useEffect, useState } from "react";
import AddAddress from "./AddAddress";
import AddressBook from "./AddressBook";
import { customerNS } from "@/nanostores/customerStore";

const DashboardAdrresses = () => {
  // const [customer, setCustomer] = useState<StoreCustomer | null>(null);
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null);

  const getProfile = async () => {
    try {
      const res = await retrieveCustomer();
      customerNS.set(res);
    } catch (error) {}
  };

  const getRegionInfo = async () => {
    try {
      const res = await getRegion("in");
      if (res) {
        setRegion(res);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getProfile();
    getRegionInfo();
  }, []);

  return (
    <>
      <div>
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="text-2xl font-semibold">Shipping Addresses</h1>
          <p className="text-base">
            View and update your shipping addresses, you can add as many as you
            like. Saving your addresses will make them available during
            checkout.
          </p>
        </div>

        {customerNS && region && <AddressBook region={region} />}
      </div>
    </>
  );
};

export default DashboardAdrresses;
