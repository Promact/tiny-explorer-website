import type { StoreProduct, StoreProductVariant } from "@medusajs/types";
import _lodash from "lodash";
import { useEffect, useMemo, useState } from "react";
import { addToCart } from "@/lib/data/cart";
import { medusa } from "@/lib/medusa";
import { getProductPrice } from "@/lib/util/get-product-price";
import { cartStore } from "@/nanostores/cartStore";

const { isEqual } = _lodash;

const optionsAsKeymap = (
	variantOptions: HttpTypes.StoreProductVariant["options"],
) => {
	// biome-ignore lint/suspicious/noExplicitAny: Medusa types
	return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
		acc[varopt.option_id] = varopt.value;
		return acc;
	}, {});
};

export const useProductLogic = (initialProduct: StoreProduct) => {
	const [product, setProduct] = useState<StoreProduct>(initialProduct);
	const [options, setOptions] = useState<Record<string, string | undefined>>(
		{},
	);
	const [qty, setQty] = useState(1);
	const [isAdding, setIsAdding] = useState(false);
	const [selectedVariant, setSelectedVariant] = useState<
		StoreProductVariant | undefined
	>();

	// Use the initial product, but if we wanted to refetch we could.
	// Since [slug].astro fetches everything, we might not need to refetch.
	// But strictly adhering to original logic:

	const fetchProduct = useMemo(
		() => async (pId: string) => {
			try {
				const res = await medusa.store.product.list({
					fields:
						"*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+product_description.*",
					id: [pId],
				});

				if (res.products?.length > 0) {
					const item = res.products[0];
					setProduct(item);
				}
			} catch {}
		},
		[],
	);

	useEffect(() => {
		if (initialProduct?.id) {
			// Optimisation: use initialProduct if it has variants.
			if (!initialProduct.variants || initialProduct.variants.length === 0) {
				fetchProduct(initialProduct.id);
			} else {
				setProduct(initialProduct);
			}
		}
	}, [initialProduct, initialProduct?.id, fetchProduct]);

	// Initialize options
	useEffect(() => {
		if (Object.keys(options).length === 0 && product?.variants) {
			if (product.variants.length > 0) {
				const variantOptions = optionsAsKeymap(product.variants[0].options);
				setOptions(variantOptions ?? {});
			}
		}
	}, [product?.variants, options]);

	// Determine selected variant
	const derivedSelectedVariant = useMemo(() => {
		if (!product?.variants || product.variants.length === 0) return undefined;

		return product.variants.find((v) => {
			const variantOptions = optionsAsKeymap(v.options);
			return isEqual(variantOptions, options);
		});
	}, [product?.variants, options]);

	useEffect(() => {
		setSelectedVariant(derivedSelectedVariant);
	}, [derivedSelectedVariant]);

	const setOptionValue = (optionId: string, value: string) => {
		setQty(1);
		setOptions((prev) => ({
			...prev,
			[optionId]: value,
		}));
	};

	const isValidVariant = useMemo(() => {
		return product?.variants?.some((v) => {
			const variantOptions = optionsAsKeymap(v.options);
			return isEqual(variantOptions, options);
		});
	}, [product?.variants, options]);

	const inStock = useMemo(() => {
		if (selectedVariant && !selectedVariant.manage_inventory) return true;
		if (selectedVariant?.allow_backorder) return true;
		if (
			selectedVariant?.manage_inventory &&
			(selectedVariant?.inventory_quantity || 0) > 0
		)
			return true;
		return false;
	}, [selectedVariant]);

	const handleQtyChange = (newQty: number) => {
		if (
			newQty > 0 &&
			(!selectedVariant?.manage_inventory ||
				!selectedVariant?.inventory_quantity ||
				newQty <= selectedVariant.inventory_quantity)
		) {
			setQty(newQty);
		}
	};

	const selectedPrice = useMemo(() => {
		if (product) {
			const { cheapestPrice, variantPrice } = getProductPrice({
				product: product,
				variantId: selectedVariant?.id,
			});
			return selectedVariant ? variantPrice : cheapestPrice;
		}
		return null;
	}, [product, selectedVariant]);

	const addToCartAction = async () => {
		if (!selectedVariant?.id) return;
		setIsAdding(true);
		const added = await addToCart({
			variantId: selectedVariant.id,
			quantity: qty,
			countryCode: "in",
		});
		cartStore.set(added?.cart);
		setIsAdding(false);
	};

	return {
		product,
		options,
		setOptionValue,
		selectedVariant,
		isValidVariant,
		inStock,
		qty,
		handleQtyChange,
		selectedPrice,
		addToCartAction,
		isAdding,
	};
};
