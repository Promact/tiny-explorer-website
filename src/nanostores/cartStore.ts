import type { HttpTypes } from "@medusajs/types";
import { atom } from "nanostores";

export const cartStore = atom<HttpTypes.StoreCart | null>(null);
