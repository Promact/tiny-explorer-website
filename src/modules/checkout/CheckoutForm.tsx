import { listCartShippingMethods } from "@/lib/data/fulfillment";
import { listCartPaymentMethods } from "@/lib/data/payment";
import type { HttpTypes, StoreCart } from "@medusajs/types";
import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Addresses from "./Addresses";
import Shipping from "./Shipping";
import Payment from "./Payment";
import Review from "./Review";

const CheckoutForm = ({
  cart,
  setCart,
}: {
  cart: StoreCart;
  setCart: Dispatch<SetStateAction<StoreCart | null>>;
}) => {
  const [shippingMethods, setShippingMethods] = useState<
    HttpTypes.StoreCartShippingOption[] | null
  >(null);

  const [paymentMethods, setPaymentMethods] = useState<
    HttpTypes.StorePaymentProvider[] | null
  >(null);

  const [currentStep, setCurrentStep] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      const [shipping, payments] = await Promise.all([
        listCartShippingMethods(cart.id),
        listCartPaymentMethods(cart?.region?.id ?? ""),
      ]);

      setShippingMethods(shipping);
      setPaymentMethods(payments);
    } catch {}
  }, [cart.id, cart?.region?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <Addresses
          cart={cart}
          setCart={setCart}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <Shipping
          cart={cart}
          setCart={setCart}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          availableShippingMethods={shippingMethods}
        />

        <Payment
          cart={cart}
          setCart={setCart}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          availablePaymentMethods={paymentMethods}
        />

        <Review
          cart={cart}
          setCart={setCart}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </>
  );
};

export default CheckoutForm;
