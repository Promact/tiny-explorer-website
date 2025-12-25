import Cookie from "js-cookie";

export const getAuthHeaders = async (): Promise<
  | {
      authorization: string;
    }
  | {}
> => {
  const token = Cookie.get("_medusa_jwt");

  if (token && token != undefined) {
    return { authorization: `Bearer ${token}` as string };
  } else {
    return {};
  }
};

export const getCartId = async () => {
  const cookie = Cookie.get("_medusa_cart_id");
  return cookie;
};

export const setCartId = async (cartId: string) => {
  console.log("in set cart id: ", cartId);
  Cookie.set("_medusa_cart_id", cartId, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });
};

export const removeCartId = async () => {
  Cookie.remove("_medusa_cart_id");
};
