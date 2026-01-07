import type { HttpTypes } from "@medusajs/types";
import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { placeOrder } from "@/lib/data/cart";

const PhonePeButton = ({
	session,
	notReady,
	setCurrentStep,
}: {
	session: HttpTypes.StorePaymentSession;
	notReady: boolean;
	setCurrentStep: Dispatch<SetStateAction<number>>;
}) => {
	const [startPayment, setStartPayment] = useState(false);

	const phonepeCallback = async (response: unknown) => {
		if (response === "CONCLUDED") {
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

			{!notReady && session && (
				<Button onClick={handlePayment}>Checkout</Button>
			)}
		</>
	);
};

export default PhonePeButton;
