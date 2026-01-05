import type { AstroCookies } from "astro";
import Cookie from "js-cookie";

export const getAuthHeaders = async (
  astroCookie?: AstroCookies
): Promise<
  | {
      authorization: string;
    }
  | {}
> => {
  if (astroCookie) {
    const token = astroCookie.get("_medusa_jwt")?.value;
    if (token && token != undefined) {
      return { authorization: `Bearer ${token}` as string };
    } else {
      return {};
    }
  } else {
    const token = Cookie.get("_medusa_jwt");

    if (token && token != undefined) {
      return { authorization: `Bearer ${token}` as string };
    } else {
      return {};
    }
  }
};

export const getCartId = async () => {
  const cookie = Cookie.get("_medusa_cart_id");
  return cookie;
};

export const setCartId = async (cartId: string) => {
  Cookie.set("_medusa_cart_id", cartId, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });
};

export const removeCartId = async () => {
  Cookie.remove("_medusa_cart_id");
};

export const setAuthToken = async (token: string) => {
  Cookie.set("_medusa_jwt", token, {
    expires: 7,
    secure: true,
    sameSite: "Strict",
  });
};

export const removeAuthToken = async () => {
  Cookie.remove("_medusa_jwt");
};
