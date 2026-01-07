import type { HttpTypes, StoreCart } from "@medusajs/types";
import type { Dispatch, SetStateAction } from "react";
import PaymentButton from "./PaymentButton";

const Review = ({
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
	const previousStepsCompleted =
		cart &&
		cart.shipping_address &&
		cart.shipping_methods &&
		cart.shipping_methods.length > 0 &&
		cart.payment_collection;

	return (
		<>
			<div className="bg-white">
				<div className="flex flex-row items-center justify-between mb-6">
					<h2>Review</h2>
				</div>

				{currentStep == 4 && previousStepsCompleted && (
					<>
						<div className="flex items-start gap-x-1 w-full mb-6">
							<div className="w-full">
								<p className="mb-1 text-sm">
									By clicking the Place Order button, you confirm that you have
									read, understand and accept our Terms of Use, Terms of Sale
									and Returns Policy and acknowledge that you have read
									Store&apos;s Privacy Policy.
								</p>
							</div>
						</div>
						<PaymentButton
							cart={cart}
							setCart={setCart}
							currentStep={currentStep}
							setCurrentStep={setCurrentStep}
						/>
					</>
				)}
			</div>
		</>
	);
};

export default Review;
