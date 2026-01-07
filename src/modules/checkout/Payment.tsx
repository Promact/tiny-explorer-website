import type { HttpTypes, StoreCart } from "@medusajs/types";
import { CircleCheck } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { isManual, paymentInfoMap } from "@/lib/constants";
import { initiatePaymentSession, retrieveCart } from "@/lib/data/cart";
import { cartStore } from "@/nanostores/cartStore";

const Payment = ({
	cart,
	currentStep,
	setCurrentStep,
	setCart,
	availablePaymentMethods,
}: {
	cart: HttpTypes.StoreCart;
	currentStep: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
	setCart: Dispatch<SetStateAction<StoreCart | null>>;
	availablePaymentMethods: HttpTypes.StorePaymentProvider[] | null;
}) => {
	const isDevelopment = import.meta.env.DEV;

	const activeSession = cart.payment_collection?.payment_sessions?.find(
		(paymentSession: any) => paymentSession.status === "pending",
	);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
		activeSession?.provider_id ?? "",
	);

	const setPaymentMethod = async (method: string) => {
		setError(null);
		setSelectedPaymentMethod(method);
	};

	const paymentReady =
		activeSession &&
		cart &&
		cart?.shipping_methods &&
		cart?.shipping_methods.length !== 0;

	const handleEdit = () => {
		setCurrentStep(3);
	};

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			await initiatePaymentSession(cart, {
				provider_id: selectedPaymentMethod,
			});
			const updatedCart = await retrieveCart();
			setCart(updatedCart);
			cartStore.set(updatedCart);
			setCurrentStep(4);
		} catch (err) {
			if (err instanceof Error) {
				setError(err?.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setError(null);
	}, [currentStep]);

	return (
		<>
			<div className="bg-white">
				<div className="flex flex-row items-center justify-between mb-6">
					<div className="flex flex-row items-baseline gap-x-2">
						<h2>Payment</h2>
						{currentStep > 3 && <CircleCheck size="14px" />}
					</div>
					{currentStep > 3 && (
						<Button variant="ghost" onClick={handleEdit}>
							Edit
						</Button>
					)}
				</div>

				{currentStep == 3 && (
					<div>
						<div className="pb-8 md:pt-0 pt-2">
							<RadioGroup
								value={selectedPaymentMethod}
								onValueChange={(v) => setPaymentMethod(v)}
							>
								{availablePaymentMethods?.map((item) => (
									<FieldLabel
										key={item.id}
										htmlFor={item.id}
										className="cursor-pointer"
									>
										<Field orientation="horizontal">
											<RadioGroupItem
												value={item.id}
												data-testid="delivery-option-radio"
												id={item.id}
											/>
											<div className="flex w-full justify-between items-center gap-2">
												<FieldContent>
													<FieldTitle>
														{paymentInfoMap[item?.id]?.title}
													</FieldTitle>
													{isManual(item?.id) && isDevelopment && (
														<FieldDescription>
															<span className="font-semibold">Attention:</span>{" "}
															For testing purposes only.
														</FieldDescription>
													)}
												</FieldContent>

												<div>{paymentInfoMap[item?.id]?.icon}</div>
											</div>
										</Field>
									</FieldLabel>
								))}
							</RadioGroup>
						</div>

						<div>
							{error && (
								<div className="pt-2 text-destructive text-sm">{error}</div>
							)}

							<Button onClick={handleSubmit}>
								{isLoading ? (
									<>
										<Spinner />
									</>
								) : (
									<>Continue to review</>
								)}
							</Button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Payment;
