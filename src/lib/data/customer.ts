import { z } from "astro/zod";
import { medusa } from "../medusa";
import type { FetchError } from "@medusajs/js-sdk";
import { getAuthHeaders, setAuthToken } from "./cookies";
import type { HttpTypes } from "@medusajs/types";
import type { AstroCookies } from "astro";
import medusaError from "../util/medusa-error";

export const signupSchema = z.object({
  firstName: z.string().nonempty("First name is required."),
  lastName: z.string().nonempty("Last name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Valid email is required"),
  phone: z.string(),
  password: z
    .string()
    .trim()
    .nonempty("Password is required")
    .min(8, "Password of minimum length 8 is required"),
});

export const signinSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Valid email is required"),
  password: z.string().nonempty("Password is required"),
});

export const addressSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required."),
  address1: z.string().nonempty("Address is required."),
  company: z.string().optional(),
  postalCode: z.string().nonempty("Postal Code is required."),
  city: z.string().nonempty("City is required."),
  countryCode: z.string().nonempty("Country is required."),
  province: z.string().nonempty("Province / state is required."),
  phone: z.string().nonempty("Phone is required"),
});

export async function signup(data: z.infer<typeof signupSchema>) {
  const password = data.password as string;
  const customerForm = {
    email: data.email as string,
    first_name: data.firstName as string,
    last_name: data.lastName as string,
    phone: data.phone as string,
  };

  try {
    const token = await medusa.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    });

    const { customer } = await medusa.store.customer.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
    });
  } catch (error) {
    throw error;
  }
}

export async function login(data: z.infer<typeof signinSchema>) {
  try {
    const token = await medusa.auth.login("customer", "emailpass", {
      email: data.email,
      password: data.password,
    });

    if (typeof token === "string") {
      await setAuthToken(token);
    }
  } catch (error) {
    throw error;
  }
}

export async function retrieveCustomer(astroCookie?: AstroCookies) {
  let headers = {};

  headers = {
    ...(await getAuthHeaders(astroCookie)),
  };

  return await medusa.client
    .fetch<{
      customer: HttpTypes.StoreCustomer & { orders?: HttpTypes.StoreOrder[] };
    }>(`/store/customers/me`, {
      method: "GET",
      query: {
        fields: "*orders",
      },
      headers,
    })
    .then(({ customer }) => customer)
    .catch((e) => {
      throw e;
    });
}

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const updateRes = await medusa.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError);

  return updateRes;
};

export const addCustomerAddress = async (
  data: z.infer<typeof addressSchema>
): Promise<any> => {
  const address = {
    first_name: data.firstName as string,
    last_name: data.lastName as string,
    company: data.company as string,
    address_1: data.address1 as string,
    // address_2: formData.get("address_2") as string,
    city: data.city as string,
    postal_code: data.postalCode as string,
    province: data.province as string,
    country_code: data.countryCode as string,
    phone: data.phone as string,
  };

  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      return customer;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateCustomerAddress = async (
  data: z.infer<typeof addressSchema>,
  addressId: string
): Promise<any> => {
  const address = {
    first_name: data.firstName as string,
    last_name: data.lastName as string,
    company: data.company as string,
    address_1: data.address1 as string,
    // address_2: formData.get("address_2") as string,
    city: data.city as string,
    postal_code: data.postalCode as string,
    province: data.province as string,
    country_code: data.countryCode as string,
    phone: data.phone as string,
  };

  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async ({ customer }) => {
      return customer;
    })
    .catch((err) => {
      throw err;
    });
};

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  await medusa.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      return { success: true, error: null };
    })
    .catch((err) => {
      throw err;
    });
};
