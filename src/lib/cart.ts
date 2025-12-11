import { medusa } from "./medusa";

const CART_ID_KEY = "medusa_cart_id";

export const getCartId = () => {
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem(CART_ID_KEY);
    }
    return null;
};

export const createCart = async () => {
    const { cart } = await medusa.store.cart.create({});
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(CART_ID_KEY, cart.id);
    }
    return cart;
};

export const getCart = async () => {
    const cartId = getCartId();
    if (!cartId) return null;
    try {
        const { cart } = await medusa.store.cart.retrieve(cartId);
        return cart;
    } catch (e) {
        // If cart is not found (e.g. completed/expired), clear ID
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(CART_ID_KEY);
        }
        return null;
    }
};

export const addToCart = async (variantId: string, quantity: number = 1) => {
    let cartId = getCartId();
    if (!cartId) {
        const cart = await createCart();
        cartId = cart.id;
    }

    const { cart } = await medusa.store.cart.createLineItem(cartId, {
        variant_id: variantId,
        quantity,
    });
    return cart;
};
