import type { HttpTypes, StoreCart } from "@medusajs/types";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { isManual, isPhonepe } from "@/lib/constants";
import ManualTestPaymentButton from "./ManualTestPaymentButton";
import PhonePeButton from "./PhonePeButton";

const PaymentButton = ({
	cart,
	currentStep,
	setCurrentStep,
	setCart,
}: {
	cart: HttpTypes.StoreCart;
	currentStep: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
	setCart: Dispatch<SetStateAction<StoreCart | null>>;
}) => {
	const notReady =
		!cart ||
		!cart.shipping_address ||
		!cart.billing_address ||
		!cart.email ||
		(cart.shipping_methods?.length ?? 0) < 1;

	const paymentSession = cart.payment_collection?.payment_sessions?.[0];

	if (!paymentSession) {
		return <Button disabled>Select a payment method</Button>;
	}

	switch (true) {
		case isManual(paymentSession?.provider_id):
			return (
				<>
					<ManualTestPaymentButton notReady={notReady} />
				</>
			);
		case isPhonepe(paymentSession?.provider_id):
			return (
				<>
					<PhonePeButton
						session={paymentSession}
						notReady={notReady}
						cart={cart}
						currentStep={currentStep}
						setCart={setCart}
						setCurrentStep={setCurrentStep}
					/>
				</>
			);
		default:
			return <Button disabled>Select a payment method</Button>;
	}
};

export default PaymentButton;
