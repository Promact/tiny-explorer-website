import type React from "react";
import { useEffect, useState } from "react";
import { medusa } from "../../lib/medusa";
// import { getCart } from '../../lib/cart';
import { Button } from "../common/Button";

export const CheckoutFlow = () => {
	const [cart, setCart] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		first_name: "",
		last_name: "",
		address_1: "",
		city: "",
		postal_code: "",
		country_code: "in", // Default to India
	});

	useEffect(() => {
		const initCart = async () => {
			// const c = await getCart();
			// setCart(c);
			setLoading(false);
		};
		initCart();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handlePlaceOrder = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!cart) return;
		setSubmitting(true);
		try {
			// 1. Update Cart with Email and Address
			await medusa.store.cart.update(cart.id, {
				email: formData.email,
				shipping_address: {
					first_name: formData.first_name,
					last_name: formData.last_name,
					address_1: formData.address_1,
					city: formData.city,
					postal_code: formData.postal_code,
					country_code: formData.country_code,
				},
			});

			// 2. Initialize Payment Sessions (Required for completion usually)
			// await medusa.store.cart.createPaymentSessions(cart.id);

			// 3. Complete Cart (Assuming manual payment or simplified flow)
			const response = await medusa.store.cart.complete(cart.id);

			if (response.type === "order") {
				alert(`Order Placed Successfully! Order ID: ${response.order.id}`);
				// Clear cart from local storage
				localStorage.removeItem("medusa_cart_id");
				window.location.href = "/"; // Redirect home
			} else {
				alert("Order incompletion type: " + response.type);
			}
		} catch (err) {
			console.error("Checkout Error", err);
			// alert("Failed to place order. Check console for details.");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <div className="text-center py-20">Loading Cart...</div>;

	if (!cart || !cart.items || cart.items.length === 0) {
		return (
			<div className="text-center py-20">
				<h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
				<a href="/shop" className="text-primary hover:underline">
					Continue Shopping
				</a>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
			{/* Checkout Form */}
			<div>
				<h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
				<form onSubmit={handlePlaceOrder} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							name="email"
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-3 border"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								First Name
							</label>
							<input
								type="text"
								name="first_name"
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border"
								value={formData.first_name}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Last Name
							</label>
							<input
								type="text"
								name="last_name"
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border"
								value={formData.last_name}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Address
						</label>
						<input
							type="text"
							name="address_1"
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border"
							value={formData.address_1}
							onChange={handleChange}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								City
							</label>
							<input
								type="text"
								name="city"
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border"
								value={formData.city}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Postal Code
							</label>
							<input
								type="text"
								name="postal_code"
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border"
								value={formData.postal_code}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="pt-6">
						<Button type="submit" size="lg" fullWidth disabled={submitting}>
							{submitting ? "Placing Order..." : "Place Order"}
						</Button>
					</div>
				</form>
			</div>

			{/* Cart Summary */}
			<div className="bg-gray-50 p-6 rounded-2xl h-fit">
				<h2 className="text-2xl font-bold mb-6">Order Summary</h2>
				<div className="space-y-4 mb-6">
					{cart.items.map((item: any) => (
						<div key={item.id} className="flex gap-4">
							<div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
								<img
									src={item.thumbnail}
									alt={item.title}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex-1">
								<h3 className="font-medium">{item.title}</h3>
								<p className="text-sm text-gray-500">{item.description}</p>
								<p className="text-sm">Qty: {item.quantity}</p>
							</div>
							<div className="font-medium">
								₹{(item.unit_price / 100).toLocaleString("en-IN")}
							</div>
						</div>
					))}
				</div>
				<div className="border-t border-gray-200 pt-4 space-y-2">
					<div className="flex justify-between">
						<span>Subtotal</span>
						<span>₹{(cart.subtotal / 100).toLocaleString("en-IN")}</span>
					</div>
					<div className="flex justify-between font-bold text-lg pt-2">
						<span>Total</span>
						<span>₹{(cart.total / 100).toLocaleString("en-IN")}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
