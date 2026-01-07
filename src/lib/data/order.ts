import type { HttpTypes } from "@medusajs/types";
import { medusa } from "../medusa";
import { getAuthHeaders } from "./cookies";
import medusaError from "../util/medusa-error";
import type { AstroCookies } from "astro";

export const retrieveOrder = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
      },
      headers,
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err));
};

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>,
  astroCookie?: AstroCookies
) => {
  const headers = {
    ...(await getAuthHeaders(astroCookie)),
  };

  return medusa.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
        ...filters,
      },
      headers,
    })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err));
};
