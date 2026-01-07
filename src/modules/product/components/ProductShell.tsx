import type { StoreProduct } from "@medusajs/types";
import { Container } from "../../../components/common/Container";
import { useProductLogic } from "../hooks/useProductLogic";
import BuyBox from "./BuyBox";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

export interface ProductPageContent {
	// biome-ignore lint/suspicious/noExplicitAny: CMS data structure is flexible
	shippingInfo: any;
	// biome-ignore lint/suspicious/noExplicitAny: CMS data structure is flexible
	returnPolicy: any;
	secureTransactionText: string;
	// biome-ignore lint/suspicious/noExplicitAny: CMS mixed content
	trustBadges: any[];
	sidebarPromoTitle: string;
	sidebarPromoText: string;
}

const ProductShell = ({
	product,
	staticContent,
}: {
	product: StoreProduct;
	staticContent?: ProductPageContent;
}) => {
	const {
		product: fetchedProduct,
		options,
		setOptionValue,
		selectedVariant,
		isValidVariant,
		inStock,
		qty,
		handleQtyChange,
		addToCartAction,
		isAdding,
	} = useProductLogic(product);

	const images =
		Array.isArray(selectedVariant?.metadata?.images) &&
		selectedVariant?.metadata?.images?.length > 0
			? // biome-ignore lint/suspicious/noExplicitAny: Metadata image items
				selectedVariant?.metadata?.images?.map((item: any) => item?.url)
			: product?.images?.map((item) => item?.url);

	return (
		<Container>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
				{/* Left Column: Gallery */}
				<div className="lg:col-span-5">
					<div className="sticky top-24">
						{images && images.length > 0 && <ProductGallery imgUrls={images} />}
					</div>
				</div>

				{/* Middle Column: Product Details */}
				<div className="lg:col-span-4">
					<ProductInfo
						product={fetchedProduct || product}
						options={options}
						setOptionValue={setOptionValue}
						isAdding={isAdding}
						selectedVariant={selectedVariant}
					/>
				</div>

				{/* Right Column: Buy Box */}
				<div className="lg:col-span-3">
					<BuyBox
						product={fetchedProduct || product}
						selectedVariant={selectedVariant}
						isValidVariant={isValidVariant}
						inStock={inStock}
						qty={qty}
						handleQtyChange={handleQtyChange}
						addToCartAction={addToCartAction}
						isAdding={isAdding}
						staticContent={staticContent}
					/>
				</div>
			</div>
		</Container>
	);
};

export default ProductShell;
