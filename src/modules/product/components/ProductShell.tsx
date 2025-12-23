import type { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { Container } from "../../../components/common/Container";
import { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductAction from "./ProductAction";

const ProductShell = ({ product }: { product: StoreProduct }) => {
  const [selectedVariant, setSelectedVariant] = useState<StoreProductVariant>();

  return (
    <>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-100">
              {Array.isArray(selectedVariant?.metadata?.images) &&
              selectedVariant?.metadata?.images?.length > 0 ? (
                <ProductGallery
                  imgUrls={selectedVariant?.metadata?.images?.map(
                    (item) => item?.url
                  )}
                />
              ) : (
                <>
                  {Array.isArray(product?.images) &&
                  product?.images?.length > 0 ? (
                    <ProductGallery
                      imgUrls={product?.images?.map((item) => item?.url)}
                    />
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <div className="mb-2">{product?.collection?.title || "Shop"}</div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-main mb-6">
              {product.title}
            </h1>
            <div className="prose prose-lg text-text-muted mb-8">
              <p>{product.description}</p>
            </div>
            <ProductAction
              productId={product?.id}
              setSelectedVariant={setSelectedVariant}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default ProductShell;
