import { zodResolver } from "@hookform/resolvers/zod";
import type { HttpTypes, StoreCart } from "@medusajs/types";
import { z } from "astro/zod";
import { type Dispatch, type SetStateAction, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { retrieveCart, setAddresses } from "@/lib/data/cart";
import { cartStore } from "@/nanostores/cartStore";

const RequiredAsterisk = () => {
	return <span className="text-destructive ml-0.5">*</span>;
};

const formSchema = z
	.object({
		firstName: z.string().nonempty(),
		lastName: z.string().nonempty(),
		address1: z.string().nonempty(),
		company: z.string().optional(),
		postalCode: z.string().nonempty(),
		city: z.string().nonempty(),
		countryCode: z.string().nonempty(),
		province: z.string().nonempty(),
		phone: z.string().nonempty(),
		email: z.string().nonempty(),
		checkForSameAddress: z.boolean().optional(),
		billingFirstName: z.string().optional(),
		billingLastName: z.string().optional(),
		billingAddress1: z.string().optional(),
		billingCompany: z.string().optional(),
		billingPostalCode: z.string().optional(),
		billingCity: z.string().optional(),
		billingCountryCode: z.string().optional(),
		billingProvince: z.string().optional(),
		billingPhone: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		// Only validate billing fields if checkForSameAddress is explicitly false
		if (data.checkForSameAddress === false) {
			if (!data.billingFirstName || data.billingFirstName.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Billing first name is required",
					path: ["billingFirstName"],
				});
			}

			if (!data.billingLastName || data.billingLastName.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Billing last name is required",
					path: ["billingLastName"],
				});
			}

			if (!data.billingAddress1 || data.billingAddress1.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Billing address is required",
					path: ["billingAddress1"],
				});
			}

			if (!data.billingPostalCode || data.billingPostalCode.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Billing postal code is required",
					path: ["billingPostalCode"],
				});
			}

			if (!data.billingCity || data.billingCity.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Billing city is required",
					path: ["billingCity"],
				});
			}

			if (!data.billingCountryCode || data.billingCountryCode.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Billing country code is required",
					path: ["billingCountryCode"],
				});
			}

			if (!data.billingProvince || data.billingProvince.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Billing province is required",
					path: ["billingProvince"],
				});
			}
		}
	});

const AddressForm = ({
	cart,
	setCart,
	currentStep,
	setCurrentStep,
}: {
	cart: HttpTypes.StoreCart;
	setCart: Dispatch<SetStateAction<StoreCart | null>>;
	currentStep: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			address1: "",
			company: "",
			postalCode: "",
			city: "",
			countryCode: "",
			province: "",
			phone: "",
			email: "",
			checkForSameAddress: true,
			billingFirstName: "",
			billingLastName: "",
			billingAddress1: "",
			billingCompany: "",
			billingPostalCode: "",
			billingCity: "",
			billingCountryCode: "",
			billingProvince: "",
			billingPhone: "",
		},
	});

	const watchSameAddress = form.watch("checkForSameAddress");
	const watchCountry = form.watch("countryCode");

	const setFormAddress = (
		address?: HttpTypes.StoreCartAddress,
		email?: string,
	) => {
		if (address) {
			form.setValue("firstName", address?.first_name || "");
			form.setValue("lastName", address?.last_name || "");
			form.setValue("address1", address?.address_1 || "");
			form.setValue("company", address?.company || "");
			form.setValue("postalCode", address?.postal_code || "");
			form.setValue("city", address?.city || "");
			form.setValue("countryCode", address?.country_code || "");
			form.setValue("province", address?.province || "");
			form.setValue("phone", address?.phone || "");
		}

		if (email) {
			form.setValue("email", email);
		}
	};

	const countryOptions = useMemo(() => {
		if (!cart.region) {
			return [];
		}

		return cart.region.countries?.map((country) => ({
			value: country.iso_2,
			label: country.display_name,
		}));
	}, [cart]);

	// Writting this use effect, as it seems there is some issue with shadcn select and react hook form.
	useEffect(() => {
		if (watchCountry === "" && cart?.shipping_address?.country_code) {
			form.setValue("countryCode", cart?.shipping_address?.country_code);
		}
	}, [watchCountry]);

	useEffect(() => {
		if (cart && cart.shipping_address) {
			setFormAddress(cart?.shipping_address, cart?.email);
		}
	}, [cart]);

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const res = await setAddresses(data);
		// const cart = await retrieveCart();
		setCart(res);
		cartStore.set(res);
		setCurrentStep(2);
	};

	return (
		<>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<h2 className="mb-4">Shipping Address</h2>
				<div className="grid grid-cols-2 gap-4 mb-4">
					<Controller
						control={form.control}
						name="firstName"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-firstName">
									First Name <RequiredAsterisk />
								</FieldLabel>
								<Input
									{...field}
									id="shipping-firstName"
									aria-invalid={fieldState.invalid}
									placeholder="First Name"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="lastName"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-lastName">
									Last Name <RequiredAsterisk />
								</FieldLabel>
								<Input
									{...field}
									id="shipping-lastName"
									aria-invalid={fieldState.invalid}
									placeholder="Last Name"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="address1"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-address1">
									Address <RequiredAsterisk />
								</FieldLabel>
								<Input
									{...field}
									id="shipping-address1"
									aria-invalid={fieldState.invalid}
									placeholder="Address"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="company"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-company">Company</FieldLabel>
								<Input
									{...field}
									id="shipping-company"
									aria-invalid={fieldState.invalid}
									placeholder="Company"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="postalCode"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-postalCode">
									Postal Code <RequiredAsterisk />
								</FieldLabel>
								<Input
									{...field}
									id="shipping-postalCode"
									aria-invalid={fieldState.invalid}
									placeholder="Postal Code"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="city"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-city">
									City <RequiredAsterisk />
								</FieldLabel>
								<Input
									{...field}
									id="shipping-city"
									aria-invalid={fieldState.invalid}
									placeholder="City"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="countryCode"
						render={({ field, fieldState }) => (
							<Field orientation="responsive" data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-country">
									Country <RequiredAsterisk />
								</FieldLabel>
								<Select
									name={field.name}
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger id="shipping-country" className="w-full">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent position="item-aligned">
										{countryOptions?.map((item) => (
											<SelectItem
												key={item?.value}
												value={item?.value as string}
											>
												{item?.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="province"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-province">
									State / Province <RequiredAsterisk />
								</FieldLabel>
								<Input
									{...field}
									id="shipping-province"
									aria-invalid={fieldState.invalid}
									placeholder="State / Province"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<div className="mb-4">
					<Controller
						control={form.control}
						name="checkForSameAddress"
						render={({ field, fieldState }) => (
							<Field orientation="horizontal">
								<Checkbox
									id="sameAddress"
									name={field.name}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
								<FieldLabel htmlFor="sameAddress" className="font-normal">
									Billing address same as shipping address
								</FieldLabel>
							</Field>
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4 mb-8">
					<Controller
						control={form.control}
						name="email"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-email">
									Email <RequiredAsterisk />
								</FieldLabel>
								<Input
									{...field}
									id="shipping-email"
									aria-invalid={fieldState.invalid}
									placeholder="Email"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="phone"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shipping-phone">Phone</FieldLabel>
								<Input
									{...field}
									id="shipping-phone"
									aria-invalid={fieldState.invalid}
									placeholder="Phone"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				{!watchSameAddress && (
					<>
						<h3 className="mb-4">Billing Address</h3>

						<div className="grid grid-cols-2 gap-4 mb-4">
							<Controller
								control={form.control}
								name="billingFirstName"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="billing-firstName">
											First Name <RequiredAsterisk />
										</FieldLabel>
										<Input
											{...field}
											id="billing-firstName"
											aria-invalid={fieldState.invalid}
											placeholder="First Name"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="billingLastName"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="billing-lastName">
											Last Name <RequiredAsterisk />
										</FieldLabel>
										<Input
											{...field}
											id="billing-lastName"
											aria-invalid={fieldState.invalid}
											placeholder="Last Name"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="billingAddress1"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="billing-address1">
											Address <RequiredAsterisk />
										</FieldLabel>
										<Input
											{...field}
											id="billing-address1"
											aria-invalid={fieldState.invalid}
											placeholder="Address"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="billingCompany"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="billing-company">Company</FieldLabel>
										<Input
											{...field}
											id="billing-company"
											aria-invalid={fieldState.invalid}
											placeholder="Company"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="billingPostalCode"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="billing-postalCode">
											Postal Code <RequiredAsterisk />
										</FieldLabel>
										<Input
											{...field}
											id="billing-postalCode"
											aria-invalid={fieldState.invalid}
											placeholder="Postal Code"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="billingCity"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="billing-city">
											City <RequiredAsterisk />
										</FieldLabel>
										<Input
											{...field}
											id="billing-city"
											aria-invalid={fieldState.invalid}
											placeholder="City"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="billingCountryCode"
								render={({ field, fieldState }) => (
									<Field
										orientation="responsive"
										data-invalid={fieldState.invalid}
									>
										<FieldLabel htmlFor="billing-country">
											Country <RequiredAsterisk />
										</FieldLabel>
										<Select
											name={field.name}
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger id="billing-country" className="w-full">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent position="item-aligned">
												{countryOptions?.map((item) => (
													<SelectItem
														key={item?.value}
														value={item?.value as string}
													>
														{item?.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="billingProvince"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="billing-province">
											State / Province <RequiredAsterisk />
										</FieldLabel>
										<Input
											{...field}
											id="billing-province"
											aria-invalid={fieldState.invalid}
											placeholder="State / Province"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="billingPhone"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="billing-phone">Phone</FieldLabel>
										<Input
											{...field}
											id="billing-phone"
											aria-invalid={fieldState.invalid}
											placeholder="Phone"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
					</>
				)}

				<Button type="submit">Continue to delivery</Button>
			</form>
		</>
	);
};

export default AddressForm;
