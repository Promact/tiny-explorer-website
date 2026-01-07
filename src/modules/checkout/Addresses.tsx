import type { HttpTypes, StoreCart } from "@medusajs/types";
import { CircleCheck } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import AddressForm from "./AddressForm";

const Addresses = ({
	cart,
	setCart,
	currentStep,
	setCurrentStep,
}: {
	cart: HttpTypes.StoreCart;
	currentStep: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
	setCart: Dispatch<SetStateAction<StoreCart | null>>;
}) => {
	return (
		<div className="bg-white">
			<div className="flex flex-row items-center justify-between mb-6">
				<div className="flex flex-row items-baseline gap-x-2">
					<h2>Address</h2>
					{currentStep !== 1 && <CircleCheck size="14px" />}
				</div>
				{currentStep > 1 && (
					<Button variant="ghost" onClick={() => setCurrentStep(1)}>
						Edit
					</Button>
				)}
			</div>
			{currentStep === 1 && (
				<AddressForm
					cart={cart}
					setCart={setCart}
					currentStep={currentStep}
					setCurrentStep={setCurrentStep}
				/>
			)}
		</div>
	);
};

export default Addresses;
