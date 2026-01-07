import Medusa from "@medusajs/js-sdk";

let MEDUSA_BACKEND_URL = "http://localhost:9000";
const pubKey = import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY;

if (import.meta.env.PUBLIC_MEDUSA_BACKEND_URL) {
	MEDUSA_BACKEND_URL = import.meta.env.PUBLIC_MEDUSA_BACKEND_URL;
}

export const medusa = new Medusa({
	baseUrl: MEDUSA_BACKEND_URL,
	debug: import.meta.env.NODE_ENV === "development",
	publishableKey: pubKey,
});
