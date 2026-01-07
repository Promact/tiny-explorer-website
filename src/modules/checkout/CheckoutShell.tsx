import type { StoreCart } from "@medusajs/types";
import { useCallback, useEffect, useState } from "react";
import { retrieveCart } from "@/lib/data/cart";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";

const CheckoutShell = () => {
	const [cart, setCart] = useState<StoreCart | null>(null);
	const [isCartLoading, setIsCartLoading] = useState(true);

	const getCart = useCallback(async () => {
		try {
			const res = await retrieveCart();
			setCart(res);
		} catch {
		} finally {
			setIsCartLoading(false);
		}
	}, []);

	useEffect(() => {
		getCart();
	}, [getCart]);

	if (!isCartLoading && !cart) {
		window.location.href = "/"; // Redirect home
	}

	return (
		<>
			{cart && (
				<div className="grid grid-cols-1 sm:grid-cols-[1fr_416px] gap-x-40 py-12">
					<CheckoutForm cart={cart} setCart={setCart} />
					<CheckoutSummary cart={cart} />
				</div>
			)}
		</>
	);
};

export default CheckoutShell;
