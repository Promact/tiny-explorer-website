import Medusa from "@medusajs/js-sdk";

export const medusa = new Medusa({
    baseUrl: import.meta.env.PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
    debug: import.meta.env.DEV,
    publishableKey: import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});
