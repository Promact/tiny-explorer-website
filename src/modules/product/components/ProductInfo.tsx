import type { StoreProduct, StoreProductVariant } from "@medusajs/types";
import OptionSelect from "./OptionSelect";
import ProductPrice from "./ProductPrice";

interface ProductInfoProps {
	product: StoreProduct;
	options: Record<string, string | undefined>;
	setOptionValue: (optionId: string, value: string) => void;
	isAdding: boolean;
	selectedVariant?: StoreProductVariant;
}

const ProductInfo = ({
	product,
	options,
	setOptionValue,
	isAdding,
	selectedVariant,
}: ProductInfoProps) => {
	return (
		<div className="flex flex-col gap-y-4">
			<div className="border-b border-gray-200 pb-4">
				<h2 className="text-sm text-primary font-medium tracking-wide uppercase mb-1">
					{product.collection?.title || "Tiny Explorer"}
				</h2>
				<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
					{product.title}
				</h1>
				{/* Placeholder for ratings */}
				<div className="flex items-center gap-2 mb-2">
					<div className="flex text-yellow-400">
						{[1, 2, 3, 4, 5].map((i) => (
							<span key={i}>★</span>
						))}
					</div>
					<span className="text-sm text-blue-600 hover:underline cursor-pointer">
						4.8 (120 ratings)
					</span>
				</div>
				<div className="mb-4">
					<ProductPrice product={product} variant={selectedVariant} />
				</div>
			</div>

			<div className="py-4 space-y-4">
				{/* Options */}
				{(product.variants?.length ?? 0) > 1 && (
					<div className="flex flex-col gap-y-4">
						{(product.options || []).map((option) => {
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

			<div className="border-t border-gray-200 pt-4">
				<h3 className="font-bold text-lg mb-2">About this item</h3>
				<div className="prose prose-sm text-gray-700">
					<p>{product.description}</p>
					{/* If we had bullet points in metadata, we would map them here */}
				</div>
			</div>
		</div>
	);
};

export default ProductInfo;
