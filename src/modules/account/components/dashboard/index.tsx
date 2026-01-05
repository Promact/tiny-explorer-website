import { retrieveCustomer } from "@/lib/data/customer";
import { useEffect } from "react";

const DashboardProfile = () => {
  const getProfile = async () => {
    try {
      const res = await retrieveCustomer();
      console.log({ res });
    } catch (error) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return <></>;
};

export default DashboardProfile;
