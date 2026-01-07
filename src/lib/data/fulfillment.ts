import type { HttpTypes } from "@medusajs/types";
import { medusa } from "../medusa";
import { getAuthHeaders } from "./cookies";

export const listCartShippingMethods = async (cartId: string) => {
	const headers = {
		...(await getAuthHeaders()),
	};

	return medusa.client
		.fetch<HttpTypes.StoreShippingOptionListResponse>(
			`/store/shipping-options`,
			{
				method: "GET",
				query: { cart_id: cartId },
				headers,
			},
		)
		.then(({ shipping_options }) => shipping_options)
		.catch(() => {
			return null;
		});
};

export const calculatePriceForShippingOption = async (
	optionId: string,
	cartId: string,
	data?: Record<string, unknown>,
) => {
	const headers = {
		...(await getAuthHeaders()),
	};

	const body = { cart_id: cartId, data };

	if (data) {
		body.data = data;
	}

	return medusa.client
		.fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
			`/store/shipping-options/${optionId}/calculate`,
			{
				method: "POST",
				body,
				headers,
			},
		)
		.then(({ shipping_option }) => shipping_option)
		.catch((_e) => {
			return null;
		});
};
