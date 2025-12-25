import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { placeOrder } from "@/lib/data/cart";
import type { HttpTypes, StoreCart } from "@medusajs/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

const PhonePeButton = ({
  session,
  notReady,
  cart,
  currentStep,
  setCurrentStep,
  setCart,
}: {
  session: HttpTypes.StorePaymentSession;
  notReady: boolean;
  cart: HttpTypes.StoreCart;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setCart: Dispatch<SetStateAction<StoreCart | null>>;
}) => {
  const [startPayment, setStartPayment] = useState(false);

  const phonepeCallback = async (response: unknown) => {
    if (response == "CONCLUDED") {
      const res = await placeOrder();

      if (res?.payment_collection) {
        const { payment_collection } = res;

        if (
          payment_collection &&
          (payment_collection?.status === "not_paid" ||
            payment_collection?.status === "failed" ||
            payment_collection?.status === "canceled")
        ) {
          toast.error("Payment failed or was cancelled.");

          setCurrentStep(3);
        }
      }
    } else {
      setStartPayment(false);

      toast.error("Payment failed or was cancelled.");
      setCurrentStep(3);
    }
  };

  const handlePayment = async () => {
    // @ts-expect-error phonepe checkout
    if (window?.PhonePeCheckout?.transact) {
      setStartPayment(true);
      // @ts-expect-error phonepe checkout
      await window?.PhonePeCheckout.transact({
        tokenUrl: session?.data?.redirectUrl,
        callback: phonepeCallback,
        type: "IFRAME",
      });
    } else {
      console.log("no transact");
    }
  };

  return (
    <>
      {startPayment && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-primary/50">
          <Spinner className="size-9" />
        </div>
      )}

      <Button onClick={handlePayment}>Checkout</Button>
    </>
  );
};

export default PhonePeButton;
