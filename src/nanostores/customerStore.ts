import type { HttpTypes } from "@medusajs/types";
import { atom } from "nanostores";

export const customerNS = atom<HttpTypes.StoreCustomer | null>(null);
