import type { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@/lib/util/get-product-price";

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct;
  variant?: HttpTypes.StoreProductVariant;
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  });

  const selectedPrice = variant ? variantPrice : cheapestPrice;

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />;
  }

  return (
    <div>
      <p className="text-2xl font-medium text-text-main mb-8">
        {selectedPrice?.calculated_price}
      </p>
    </div>
  );
}
