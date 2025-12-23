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
import { getProductPrice } from "../../../lib/get-product-price";
import ProductPrice from "./ProductPrice";

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

  return (
    <>
      {fetchedProduct && (
        <ProductPrice product={fetchedProduct} variant={selectedVariant} />
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <div className="w-20">Quantity: </div>
        <div className="flex items-center border-gray-200 border rounded-xl w-fit"></div>
      </div>
    </>
  );
};

export default ProductAction;
