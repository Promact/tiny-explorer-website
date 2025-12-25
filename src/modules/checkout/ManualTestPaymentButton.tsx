import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { placeOrder } from "@/lib/data/cart";
import { useState } from "react";

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handlePayment = () => {
    setSubmitting(true);

    onPaymentCompleted();
  };

  return (
    <>
      <Button disabled={notReady} onClick={handlePayment}>
        {submitting ? <Spinner /> : <>Place order</>}
      </Button>

      {errorMessage && (
        <div className="pt-2 text-destructive text-sm">{errorMessage}</div>
      )}
    </>
  );
};

export default ManualTestPaymentButton;
