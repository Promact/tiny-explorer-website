import { navigate } from "astro:transitions/client";
import type { HttpTypes } from "@medusajs/types";
import { medusa } from "../medusa";
import medusaError from "../util/medusa-error";
import { getAuthHeaders, getCartId, removeCartId, setCartId } from "./cookies";
import { getRegion } from "./region";

export async function retrieveCart(cartId?: string) {
	const id = cartId || (await getCartId());

	if (!id) {
		return null;
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	return await medusa.client
		.fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
			method: "GET",
			query: {
				fields:
					"*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
			},
			headers,
		})
		.then(({ cart }) => cart)
		.catch(() => null);
}

export async function getOrSetCart(countryCode: string) {
	const region = await getRegion(countryCode);

	if (!region) {
		throw new Error(`Region not found for country code: ${countryCode}`);
	}

	let cart = await retrieveCart();

	const headers = {
		...(await getAuthHeaders()),
	};

	if (!cart) {
		const cartResp = await medusa.store.cart.create(
			{ region_id: region.id },
			{},
			headers,
		);

		cart = cartResp.cart;

		await setCartId(cart?.id);
	}

	if (cart && cart?.region_id !== region.id) {
		await medusa.store.cart.update(
			cart.id,
			{ region_id: region.id },
			{},
			headers,
		);
	}

	return cart;
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
	const cartId = await getCartId();

	if (!cartId) {
		throw new Error(
			"No existing cart found, please create one before updating",
		);
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	return medusa.store.cart
		.update(cartId, data, {}, headers)
		.then(async ({ cart }) => {
			return cart;
		})
		.catch(medusaError);
}

export async function addToCart({
	variantId,
	quantity,
	countryCode,
}: {
	variantId: string;
	quantity: number;
	countryCode: string;
}) {
	if (!variantId) {
		throw new Error("Missing variant ID when adding to cart");
	}

	const cart = await getOrSetCart(countryCode);

	if (!cart) {
		throw new Error("Error retrieving or creating cart");
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	const added = await medusa.store.cart
		.createLineItem(
			cart.id,
			{
				variant_id: variantId,
				quantity,
			},
			{},
			headers,
		)
		.then()
		.catch(medusaError);

	return added;
}

export async function updateLineItem({
	lineId,
	quantity,
}: {
	lineId: string;
	quantity: number;
}) {
	if (!lineId) {
		throw new Error("Missing lineItem ID when updating line item");
	}

	const cartId = await getCartId();

	if (!cartId) {
		throw new Error("Missing cart ID when updating line item");
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	const res = await medusa.store.cart
		.updateLineItem(cartId, lineId, { quantity }, {}, headers)
		.then((data) => data)
		.catch(medusaError);

	return res;
}

export async function deleteLineItem(lineId: string) {
	if (!lineId) {
		throw new Error("Missing lineItem ID when deleting line item");
	}

	const cartId = await getCartId();

	if (!cartId) {
		throw new Error("Missing cart ID when deleting line item");
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	await medusa.store.cart
		.deleteLineItem(cartId, lineId, {}, headers)
		.then()
		.catch(medusaError);
}

export async function setShippingMethod({
	cartId,
	shippingMethodId,
}: {
	cartId: string;
	shippingMethodId: string;
}) {
	const headers = {
		...(await getAuthHeaders()),
	};

	return medusa.store.cart
		.addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
		.then()
		.catch(medusaError);
}

export async function initiatePaymentSession(
	cart: HttpTypes.StoreCart,
	data: {
		provider_id: string;
		context?: Record<string, unknown>;
	},
) {
	const headers = {
		...(await getAuthHeaders()),
	};

	return medusa.store.payment
		.initiatePaymentSession(cart, data, {}, headers)
		.then(async (resp) => {
			return resp;
		})
		.catch(medusaError);
}

type AddressData = {
	firstName: string;
	lastName: string;
	address1: string;
	postalCode: string;
	city: string;
	countryCode: string;
	province: string;
	phone: string;
	email: string;
	company?: string | undefined;
	checkForSameAddress?: boolean | undefined;
	billingFirstName?: string | undefined;
	billingLastName?: string | undefined;
	billingAddress1?: string | undefined;
	billingCompany?: string | undefined;
	billingPostalCode?: string | undefined;
	billingCity?: string | undefined;
	billingCountryCode?: string | undefined;
	billingProvince?: string | undefined;
	billingPhone?: string | undefined;
};

export async function setAddresses(addressData: AddressData) {
	try {
		if (!addressData) {
			throw new Error("No form data found when setting addresses");
		}
		const cartId = await getCartId();
		if (!cartId) {
			throw new Error("No existing cart found when setting addresses");
		}

		const data = {
			shipping_address: {
				first_name: addressData.firstName,
				last_name: addressData.lastName,
				address_1: addressData.address1,
				address_2: "",
				company: addressData.company,
				postal_code: addressData.postalCode,
				city: addressData.city,
				country_code: addressData.countryCode,
				province: addressData.province,
				phone: addressData.phone,
			},
			email: addressData.email,
		} as Record<string, unknown>;

		const sameAsBilling = addressData.checkForSameAddress;
		if (sameAsBilling) data.billing_address = data.shipping_address;

		if (!sameAsBilling)
			data.billing_address = {
				first_name: addressData.billingFirstName,
				last_name: addressData.billingLastName,
				address_1: addressData.billingAddress1,
				address_2: "",
				company: addressData.billingCompany,
				postal_code: addressData.billingPostalCode,
				city: addressData.billingCity,
				country_code: addressData.billingCountryCode,
				province: addressData.billingProvince,
				phone: addressData.billingPhone,
			};
		const res = await updateCart(data);
		return res;
	} catch (e) {
		return (e as Error).message;
	}

	//   redirect(
	//     `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
	//   )
}

export async function placeOrder(cartId?: string) {
	const id = cartId || (await getCartId());

	if (!id) {
		throw new Error("No existing cart found when placing an order");
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	const cartRes = await medusa.store.cart
		.complete(id, {}, headers)
		.then(async (cartRes) => {
			return cartRes;
		})
		.catch(medusaError);

	if (cartRes?.type === "order") {
		// const countryCode =
		//   cartRes.order.shipping_address?.country_code?.toLowerCase();
		await removeCartId();
		navigate(`/order/${cartRes?.order?.id}/confirmed`);
	} else {
		return cartRes.cart;
	}
}

export async function updateRegion(countryCode: string, _currentPath: string) {
	const cartId = await getCartId();
	const region = await getRegion(countryCode);

	if (!region) {
		throw new Error(`Region not found for country code: ${countryCode}`);
	}

	if (cartId) {
		await updateCart({ region_id: region.id });
	}

	//   redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
	const cartId = await getCartId();
	const headers = {
		...(await getAuthHeaders()),
	};

	return await medusa.client.fetch<{
		shipping_options: HttpTypes.StoreCartShippingOption[];
	}>("/store/shipping-options", {
		query: { cart_id: cartId },
		headers,
	});
}

export async function removePaymentSession(provider_id: string) {
	const cartId = await getCartId();

	const headers = {
		...(await getAuthHeaders()),
	};

	if (cartId) {
		return medusa.client.fetch(
			`/store/carts/${cartId}/payment-sessions/${provider_id}`,
			{
				method: "DELETE",
				headers,
			},
		);
	}

	//   redirect(`/checkout?step=payment`)
}
