import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { medusa } from "../../../lib/medusa";
import type {
  HttpTypes,
  StoreProduct,
  StoreProductVariant,
} from "@medusajs/types";
import _lodash from "lodash";
import { getProductPrice } from "@/lib/util/get-product-price";
import ProductPrice from "./ProductPrice";
import { Button } from "@/components/ui/button";

import { ChevronRight, Minus, Plus } from "lucide-react";
import OptionSelect from "./OptionSelect";
import { Spinner } from "@/components/ui/spinner";
import { addToCart } from "@/lib/data/cart";
import { useStore } from "@nanostores/react";
import { cartStore } from "@/nanostores/cartStore";

const { isEqual } = _lodash;

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value;
    return acc;
  }, {});
};

const ProductAction = ({
  productId,
  setSelectedVariant,
}: {
  productId: string;
  setSelectedVariant: Dispatch<SetStateAction<StoreProductVariant | undefined>>;
}) => {
  const [fetchedProduct, setFetchedProduct] = useState<StoreProduct>();
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    {}
  );
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const cart = useStore(cartStore);

  const fetchProduct = async (pId: string) => {
    try {
      const res = await medusa.store.product.list({
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+product_description.*",
        id: [pId],
      });

      if (res.products?.length > 0) {
        const item = res.products[0];
        setFetchedProduct(item);
      }
    } catch {}
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (Object.keys(options).length == 0) {
      if (fetchedProduct?.variants?.length === 1) {
        const variantOptions = optionsAsKeymap(
          fetchedProduct?.variants[0].options
        );
        setOptions(variantOptions ?? {});
      } else if (
        fetchedProduct &&
        fetchedProduct?.variants &&
        fetchedProduct?.variants?.length > 0
      ) {
        const variantOptions = optionsAsKeymap(
          fetchedProduct?.variants[0].options
        );
        setOptions(variantOptions ?? {});
      }
    }
  }, [fetchedProduct?.variants]);

  const selectedVariant = useMemo(() => {
    if (!fetchedProduct?.variants || fetchedProduct?.variants?.length === 0) {
      return;
    }

    const item = fetchedProduct?.variants?.find((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });

    return item;
  }, [fetchedProduct?.variants, options]);

  useEffect(() => {
    if (selectedVariant) {
      setSelectedVariant(selectedVariant);
    }
  }, [selectedVariant]);

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setQty(1);
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return fetchedProduct?.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
  }, [fetchedProduct?.variants, options]);

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true;
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true;
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true;
    }

    // Otherwise, we can't add to cart
    return false;
  }, [selectedVariant]);

  const handleQtyChange = (newQty: number) => {
    if (
      newQty &&
      selectedVariant &&
      selectedVariant?.inventory_quantity &&
      newQty <= selectedVariant?.inventory_quantity
    ) {
      setQty(newQty);
    }
  };

  const selectedPrice = useMemo(() => {
    if (fetchedProduct) {
      const { cheapestPrice, variantPrice } = getProductPrice({
        product: fetchedProduct,
        variantId: selectedVariant?.id,
      });

      return selectedVariant ? variantPrice : cheapestPrice;
    }
    return null;
  }, [fetchedProduct, selectedVariant]);

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null;

    setIsAdding(true);

    const added = await addToCart({
      variantId: selectedVariant.id,
      quantity: qty,
      countryCode: "in",
    });

    cartStore.set(added?.cart);

    setIsAdding(false);
  };

  return (
    <>
      {fetchedProduct && (
        <ProductPrice product={fetchedProduct} variant={selectedVariant} />
      )}

      <div className="flex flex-wrap gap-2 items-center mb-8">
        <div className="w-20">Quantity: </div>
        <div className="flex items-center border-gray-200 border rounded-lg w-fit">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleQtyChange(qty - 1)}
          >
            <Minus />
          </Button>
          <span className="px-2">{qty}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleQtyChange(qty + 1)}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          {(fetchedProduct?.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(fetchedProduct?.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={isAdding}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <Button
          type="button"
          disabled={
            !inStock ||
            !selectedVariant ||
            isAdding ||
            !isValidVariant ||
            !selectedPrice
          }
          onClick={handleAddToCart}
          className="w-full"
        >
          {isAdding ? (
            <Spinner />
          ) : (
            <>
              {!selectedVariant && !options
                ? "Select variant"
                : !inStock || !isValidVariant
                ? "Out of stock"
                : "Add to cart"}
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default ProductAction;
