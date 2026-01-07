import { retrieveCustomer } from "@/lib/data/customer";
import type { StoreCustomer } from "@medusajs/types";
import { useEffect, useState } from "react";

const DashboardProfile = () => {
  const [customer, setCustomer] = useState<StoreCustomer | null>(null);

  const getProfile = async () => {
    try {
      const res = await retrieveCustomer();
      setCustomer(res);
    } catch (error) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <div>
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-base">
            View and update your profile information, including your name,
            email, and phone number. You can also update your billing address,
            or change your password.
          </p>
        </div>

        <div className="flex flex-col gap-y-8 w-full"></div>
      </div>
    </>
  );
};

export default DashboardProfile;
