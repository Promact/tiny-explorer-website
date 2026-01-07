import type { FetchError } from "@medusajs/js-sdk";
import { z } from "astro/zod";
import { medusa } from "../medusa";
import { setAuthToken } from "./cookies";

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

		console.log({ token });

		const { customer } = await medusa.store.customer.create({
			first_name: data.firstName,
			last_name: data.lastName,
			email: data.email,
		});

		console.log(customer);
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
